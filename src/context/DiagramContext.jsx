import { createContext, useCallback, useMemo, useState } from "react";
import { Action, DB, ObjectType, defaultBlue } from "../data/constants";
import { useTransform, useUndoRedo, useSelect } from "../hooks";
import { Toast } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

export const DiagramContext = createContext(null);

export default function DiagramContextProvider({ children }) {
  const { t } = useTranslation();
  const [database, setDatabase] = useState(DB.GENERIC);
  const [tables, setTables] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const { transform } = useTransform();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { selectedElement, setSelectedElement } = useSelect();

  // O(1) table lookup map for Relationship components
  const tablesMap = useMemo(() => {
    const map = new Map();
    tables.forEach((t) => map.set(t.id, t));
    return map;
  }, [tables]);

  const addTable = useCallback(
    (data, addToHistory = true) => {
      const id = nanoid();
      const newTable = {
        id,
        name: `table_${id}`,
        x: transform.pan.x,
        y: transform.pan.y,
        locked: false,
        fields: [
          {
            name: "id",
            type: database === DB.GENERIC ? "INT" : "INTEGER",
            default: "",
            check: "",
            primary: true,
            unique: false,
            unsigned: true,
            notNull: true,
            increment: true,
            comment: "",
            id: nanoid(),
          },
        ],
        comment: "",
        indices: [],
        color: defaultBlue,
      };
      if (data) {
        setTables((prev) => {
          const temp = prev.slice();
          temp.splice(data.index || prev.length, 0, data.table);
          return temp;
        });
      } else {
        setTables((prev) => [...prev, newTable]);
      }
      if (addToHistory) {
        setUndoStack((prev) => [
          ...prev,
          {
            data: data || { table: newTable, index: tables.length - 1 },
            action: Action.ADD,
            element: ObjectType.TABLE,
            message: t("add_table"),
          },
        ]);
        setRedoStack([]);
      }
    },
    [database, transform.pan.x, transform.pan.y, tables.length, t, setUndoStack, setRedoStack],
  );

  const deleteTable = useCallback(
    (id, addToHistory = true) => {
      if (addToHistory) {
        setTables((prev) => {
          const deletedTable = prev.find((t) => t.id === id);
          const deletedTableIndex = prev.findIndex((t) => t.id === id);
          setRelationships((prevR) => {
            const rels = prevR.filter(
              (r) => r.startTableId === id || r.endTableId === id,
            );
            setUndoStack((prevUndo) => [
              ...prevUndo,
              {
                action: Action.DELETE,
                element: ObjectType.TABLE,
                data: {
                  table: deletedTable,
                  relationship: rels,
                  index: deletedTableIndex,
                },
                message: t("delete_table", { tableName: deletedTable.name }),
              },
            ]);
            setRedoStack([]);
            return prevR.filter(
              (e) => !(e.startTableId === id || e.endTableId === id),
            );
          });
          Toast.success(t("table_deleted"));
          return prev.filter((e) => e.id !== id);
        });
      } else {
        setRelationships((prevR) =>
          prevR.filter((e) => !(e.startTableId === id || e.endTableId === id)),
        );
        setTables((prev) => prev.filter((e) => e.id !== id));
      }
      setSelectedElement((prev) => {
        if (prev.id === id) {
          return {
            ...prev,
            element: ObjectType.NONE,
            id: null,
            open: false,
          };
        }
        return prev;
      });
    },
    [t, setUndoStack, setRedoStack, setSelectedElement],
  );

  const updateTable = useCallback((id, updatedValues) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedValues } : t)),
    );
  }, []);

  const updateField = useCallback((tid, fid, updatedValues) => {
    setTables((prev) =>
      prev.map((table) => {
        if (tid === table.id) {
          return {
            ...table,
            fields: table.fields.map((field) =>
              fid === field.id ? { ...field, ...updatedValues } : field,
            ),
          };
        }
        return table;
      }),
    );
  }, []);

  const deleteField = useCallback(
    (field, tid, addToHistory = true) => {
      setTables((prev) => {
        const table = prev.find((t) => t.id === tid);
        if (!table) return prev;
        const { fields, name } = table;
        if (addToHistory) {
          setRelationships((prevR) => {
            const rels = prevR.filter(
              (r) =>
                (r.startTableId === tid && r.startFieldId === field.id) ||
                (r.endTableId === tid && r.endFieldId === field.id),
            );
            setUndoStack((prevUndo) => [
              ...prevUndo,
              {
                action: Action.EDIT,
                element: ObjectType.TABLE,
                component: "field_delete",
                tid: tid,
                data: {
                  field: field,
                  index: fields.findIndex((f) => f.id === field.id),
                  relationship: rels,
                },
                message: t("edit_table", {
                  tableName: name,
                  extra: "[delete field]",
                }),
              },
            ]);
            setRedoStack([]);
            return prevR.filter(
              (e) =>
                !(
                  (e.startTableId === tid && e.startFieldId === field.id) ||
                  (e.endTableId === tid && e.endFieldId === field.id)
                ),
            );
          });
        } else {
          setRelationships((prevR) =>
            prevR.filter(
              (e) =>
                !(
                  (e.startTableId === tid && e.startFieldId === field.id) ||
                  (e.endTableId === tid && e.endFieldId === field.id)
                ),
            ),
          );
        }
        return prev.map((t) =>
          t.id === tid
            ? { ...t, fields: t.fields.filter((f) => f.id !== field.id) }
            : t,
        );
      });
    },
    [t, setUndoStack, setRedoStack],
  );

  const addRelationship = useCallback(
    (data, addToHistory = true) => {
      if (addToHistory) {
        setRelationships((prev) => {
          setUndoStack((prevUndo) => [
            ...prevUndo,
            {
              action: Action.ADD,
              element: ObjectType.RELATIONSHIP,
              data: {
                relationship: data,
                index: prevUndo.length,
              },
              message: t("add_relationship"),
            },
          ]);
          setRedoStack([]);
          return [...prev, data];
        });
      } else {
        setRelationships((prev) => {
          const temp = prev.slice();
          temp.splice(data.index, 0, data.relationship || data);
          return temp;
        });
      }
    },
    [t, setUndoStack, setRedoStack],
  );

  const deleteRelationship = useCallback(
    (id, addToHistory = true) => {
      if (addToHistory) {
        setRelationships((prev) => {
          const relationshipIndex = prev.findIndex((r) => r.id === id);
          setUndoStack((prevUndo) => [
            ...prevUndo,
            {
              action: Action.DELETE,
              element: ObjectType.RELATIONSHIP,
              data: {
                relationship: prev[relationshipIndex],
                index: relationshipIndex,
              },
              message: t("delete_relationship", {
                refName: prev[relationshipIndex].name,
              }),
            },
          ]);
          setRedoStack([]);
          return prev.filter((e) => e.id !== id);
        });
      } else {
        setRelationships((prev) => prev.filter((e) => e.id !== id));
      }
    },
    [t, setUndoStack, setRedoStack],
  );

  const updateRelationship = useCallback((id, updatedValues) => {
    setRelationships((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedValues } : t)),
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      tables,
      setTables,
      addTable,
      updateTable,
      updateField,
      deleteField,
      deleteTable,
      relationships,
      setRelationships,
      addRelationship,
      deleteRelationship,
      updateRelationship,
      database,
      setDatabase,
      tablesMap,
      tablesCount: tables.length,
      relationshipsCount: relationships.length,
    }),
    [
      tables,
      addTable,
      updateTable,
      updateField,
      deleteField,
      deleteTable,
      relationships,
      addRelationship,
      deleteRelationship,
      updateRelationship,
      database,
      tablesMap,
    ],
  );

  return (
    <DiagramContext.Provider value={contextValue}>
      {children}
    </DiagramContext.Provider>
  );
}

