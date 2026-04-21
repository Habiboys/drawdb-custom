import { IconEyeClosed, IconEyeOpened, IconPlus } from "@douyinfe/semi-icons";
import { Button, Collapse } from "@douyinfe/semi-ui";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Action, ObjectType, State } from "../../../data/constants";
import {
  useAreas,
  useDiagram,
  useLayout,
  useSaveState,
  useSelect,
  useSettings,
  useUndoRedo,
} from "../../../hooks";
import { DragHandle } from "../../SortableList/DragHandle";
import { SortableList } from "../../SortableList/SortableList";
import Empty from "../Empty";
import SearchBar from "./SearchBar";
import TableInfo from "./TableInfo";

export default function TablesTab() {
  const { tables, addTable, setTables } = useDiagram();
  const { areas } = useAreas();
  const { settings } = useSettings();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();
  const { layout } = useLayout();
  const { setSaveState } = useSaveState();
  const [groupByArea, setGroupByArea] = useState(false);

  const groupedTables = useMemo(() => {
    const groups = areas.map((area) => ({ ...area, tables: [] }));
    const ungrouped = [];

    const getTableContainerArea = (table) => {
      const assignedArea = groups.find(
        (area) => area.groupId && area.groupId === table.areaGroupId,
      );
      if (assignedArea) return assignedArea;

      const centerX = table.x + settings.tableWidth / 2;
      const centerY = table.y + 20;

      return groups.find(
        (area) =>
          centerX >= area.x &&
          centerX <= area.x + area.width &&
          centerY >= area.y &&
          centerY <= area.y + area.height,
      );
    };

    for (const table of tables) {
      const containerArea = getTableContainerArea(table);

      if (containerArea) {
        containerArea.tables.push(table);
      } else {
        ungrouped.push(table);
      }
    }

    return {
      groups: groups.filter((group) => group.tables.length > 0),
      ungrouped,
    };
  }, [areas, settings.tableWidth, tables]);

  const activeCollapseKey =
    selectedElement.open && selectedElement.element === ObjectType.TABLE
      ? `${selectedElement.id}`
      : "";

  const handleCollapseChange = (k) => {
    setSelectedElement((prev) => ({
      ...prev,
      open: true,
      id: k[0],
      element: ObjectType.TABLE,
    }));
  };

  return (
    <>
      <div className="flex gap-2">
        <SearchBar tables={tables} />
        <Button
          theme={groupByArea ? "solid" : "light"}
          onClick={() => setGroupByArea((prev) => !prev)}
          disabled={areas.length === 0}
        >
          {t("group_by_area", { defaultValue: "Group by area" })}
        </Button>
        <div>
          <Button
            block
            icon={<IconPlus />}
            onClick={() => addTable()}
            disabled={layout.readOnly}
          >
            {t("add_table")}
          </Button>
        </div>
      </div>
      {tables.length === 0 ? (
        <Empty title={t("no_tables")} text={t("no_tables_text")} />
      ) : groupByArea && areas.length > 0 ? (
        <div className="mt-2">
          {groupedTables.groups.map((area) => (
            <div key={area.id} className="mb-3">
              <div className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {area.name} ({area.tables.length})
              </div>
              <Collapse
                activeKey={activeCollapseKey}
                keepDOM={false}
                lazyRender
                onChange={handleCollapseChange}
                accordion
              >
                {area.tables.map((item) => (
                  <TableListItem key={item.id} table={item} />
                ))}
              </Collapse>
            </div>
          ))}

          {groupedTables.ungrouped.length > 0 && (
            <div className="mb-2">
              <div className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("ungrouped", { defaultValue: "Ungrouped" })} (
                {groupedTables.ungrouped.length})
              </div>
              <Collapse
                activeKey={activeCollapseKey}
                keepDOM={false}
                lazyRender
                onChange={handleCollapseChange}
                accordion
              >
                {groupedTables.ungrouped.map((item) => (
                  <TableListItem key={item.id} table={item} />
                ))}
              </Collapse>
            </div>
          )}
        </div>
      ) : (
        <Collapse
          activeKey={activeCollapseKey}
          keepDOM={false}
          lazyRender
          onChange={handleCollapseChange}
          accordion
        >
          <SortableList
            keyPrefix="tables-tab"
            items={tables}
            onChange={(newTables) => setTables(newTables)}
            afterChange={() => setSaveState(State.SAVING)}
            renderItem={(item) => <TableListItem table={item} />}
          />
        </Collapse>
      )}
    </>
  );
}

function TableListItem({ table }) {
  const { layout } = useLayout();
  const { updateTable } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { t } = useTranslation();

  const toggleTableVisibility = (e) => {
    e.stopPropagation();
    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.TABLE,
        component: "self",
        tid: table.id,
        undo: { hidden: table.hidden },
        redo: { hidden: !table.hidden },
        message: t("edit_table", {
          tableName: table.name,
          extra: "[hidden]",
        }),
      },
    ]);
    setRedoStack([]);
    updateTable(table.id, { hidden: !table.hidden });
  };

  return (
    <div id={`scroll_table_${table.id}`}>
      <Collapse.Panel
        className="relative"
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-1">
              <DragHandle readOnly={layout.readOnly} id={table.id} />
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {table.name}
              </div>
            </div>
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              onClick={toggleTableVisibility}
              icon={table.hidden ? <IconEyeClosed /> : <IconEyeOpened />}
              className="me-2"
            />
            <div
              className="w-1 h-full absolute top-0 left-0 bottom-0"
              style={{ backgroundColor: table.color }}
            />
          </div>
        }
        itemKey={`${table.id}`}
      >
        <TableInfo data={table} />
      </Collapse.Panel>
    </div>
  );
}
