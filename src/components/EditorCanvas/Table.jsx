import {
  IconDeleteStroked,
  IconEdit,
  IconKeyStroked,
  IconLock,
  IconMinus,
  IconMore,
  IconUnlock,
} from "@douyinfe/semi-icons";
import { Button, Popover, SideSheet, Tag } from "@douyinfe/semi-ui";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ObjectType,
  Tab,
  tableColorStripHeight,
  tableFieldHeight,
  tableHeaderHeight,
} from "../../data/constants";
import { useDiagram, useLayout, useSelect, useSettings } from "../../hooks";
import i18n from "../../i18n/i18n";
import { isRtl } from "../../i18n/utils/rtl";
import { resolveType } from "../../utils/customTypes";
import { getCommentHeight, getTableHeight } from "../../utils/utils";
import TableInfo from "../EditorSidePanel/TablesTab/TableInfo";

function Table({
  tableData,
  onPointerDown,
  setHoveredTable,
  handleGripField,
  setLinkingLine,
}) {
  const [hoveredField, setHoveredField] = useState(null);
  const { tablesCount, database, deleteTable, deleteField, updateTable } =
    useDiagram();
  const { layout } = useLayout();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const {
    selectedElement,
    setSelectedElement,
    bulkSelectedElements,
    setBulkSelectedElements,
  } = useSelect();

  const borderColor = useMemo(
    () => (settings.mode === "light" ? "border-zinc-400" : "border-zinc-700"),
    [settings.mode],
  );

  const tableThemeClass =
    settings.mode === "light"
      ? "bg-zinc-100 text-zinc-800"
      : "bg-zinc-900 text-zinc-100";

  const isLargeDiagram = tablesCount >= 50;

  const tableDepthClass = isLargeDiagram
    ? ""
    : settings.mode === "light"
      ? "shadow-[0_1px_6px_rgba(15,23,42,0.10)]"
      : "shadow-[0_1px_8px_rgba(0,0,0,0.35)]";

  const tableHeaderClass =
    settings.mode === "light"
      ? "border-zinc-300 bg-zinc-200"
      : "border-zinc-700 bg-zinc-950";

  const tableFieldBorderClass =
    settings.mode === "light" ? "border-zinc-200" : "border-zinc-700";

  const dataTypeTextClass =
    settings.mode === "light" ? "text-zinc-500" : "text-zinc-400";

  const showFieldSummaryPopover = settings.showFieldSummary && !isLargeDiagram;

  const height = getTableHeight(
    tableData,
    settings.tableWidth,
    settings.showComments,
  );

  const isSelected = useMemo(() => {
    return (
      (selectedElement.id == tableData.id &&
        selectedElement.element === ObjectType.TABLE) ||
      bulkSelectedElements.some(
        (e) => e.type === ObjectType.TABLE && e.id === tableData.id,
      )
    );
  }, [selectedElement, tableData, bulkSelectedElements]);

  const lockUnlockTable = (e) => {
    const locking = !tableData.locked;
    updateTable(tableData.id, { locked: locking });

    const lockTable = () => {
      setSelectedElement({
        ...selectedElement,
        element: ObjectType.NONE,
        id: -1,
        open: false,
      });
      setBulkSelectedElements((prev) =>
        prev.filter(
          (el) => el.id !== tableData.id || el.type !== ObjectType.TABLE,
        ),
      );
    };

    const unlockTable = () => {
      const elementInBulk = {
        id: tableData.id,
        type: ObjectType.TABLE,
        initialCoords: { x: tableData.x, y: tableData.y },
        currentCoords: { x: tableData.x, y: tableData.y },
      };
      if (e.ctrlKey || e.metaKey) {
        setBulkSelectedElements((prev) => [...prev, elementInBulk]);
      } else {
        setBulkSelectedElements([elementInBulk]);
      }
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.TABLE,
        id: tableData.id,
        open: false,
      }));
    };

    if (locking) {
      lockTable();
    } else {
      unlockTable();
    }
  };

  const openEditor = () => {
    if (!layout.sidebar) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.TABLE,
        id: tableData.id,
        open: true,
      }));
    } else {
      setSelectedElement((prev) => ({
        ...prev,
        currentTab: Tab.TABLES,
        element: ObjectType.TABLE,
        id: tableData.id,
        open: true,
      }));
      if (selectedElement.currentTab !== Tab.TABLES) return;
      document
        .getElementById(`scroll_table_${tableData.id}`)
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  if (tableData.hidden) return null;

  return (
    <>
      <foreignObject
        key={tableData.id}
        x={tableData.x}
        y={tableData.y}
        width={settings.tableWidth}
        height={height}
        className="group cursor-move"
        onPointerDown={onPointerDown}
      >
        <div
          onDoubleClick={openEditor}
          className={`w-full select-none border ${
            isLargeDiagram ? "" : "transition-colors"
          } ${tableThemeClass} ${tableDepthClass} ${
            isSelected
              ? "border-blue-600"
              : `${borderColor} hover:border-blue-300`
          }`}
          style={{ direction: "ltr" }}
        >
          <div
            className="h-[8px] w-full"
            style={{ backgroundColor: tableData.color }}
          />
          <div
            className={`border-b ${tableHeaderClass} ${
              tableData.comment && settings.showComments ? "pb-3" : ""
            }`}
          >
            <div className="flex h-[40px] items-center justify-between overflow-hidden">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap px-3 font-semibold">
                {tableData.name}
              </div>
              <div className="hidden group-hover:block">
                <div className="flex justify-end items-center mx-2 space-x-1.5">
                  <Button
                    icon={tableData.locked ? <IconLock /> : <IconUnlock />}
                    size="small"
                    theme="solid"
                    style={{
                      backgroundColor: "#334155cc",
                    }}
                    disabled={layout.readOnly}
                    onClick={lockUnlockTable}
                  />
                  <Button
                    icon={<IconEdit />}
                    size="small"
                    theme="solid"
                    style={{
                      backgroundColor: "#334155cc",
                    }}
                    onClick={openEditor}
                  />
                  <Popover
                    key={tableData.id}
                    content={
                      <div className="popover-theme">
                        <div className="mb-2">
                          <strong>{t("comment")}:</strong>{" "}
                          {tableData.comment === "" ? (
                            t("not_set")
                          ) : (
                            <div>{tableData.comment}</div>
                          )}
                        </div>
                        <div>
                          <strong
                            className={`${
                              tableData.indices.length === 0 ? "" : "block"
                            }`}
                          >
                            {t("indices")}:
                          </strong>{" "}
                          {tableData.indices.length === 0 ? (
                            t("not_set")
                          ) : (
                            <div>
                              {tableData.indices.map((index, k) => (
                                <div
                                  key={k}
                                  className={`flex items-center my-1 px-2 py-1 rounded ${
                                    settings.mode === "light"
                                      ? "bg-gray-100"
                                      : "bg-zinc-800"
                                  }`}
                                >
                                  <i className="fa-solid fa-thumbtack me-2 mt-1 text-slate-500"></i>
                                  <div>
                                    {index.fields.map((f) => (
                                      <Tag
                                        color="blue"
                                        key={f}
                                        className="me-1"
                                      >
                                        {f}
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          icon={<IconDeleteStroked />}
                          type="danger"
                          block
                          style={{ marginTop: "8px" }}
                          onClick={() => deleteTable(tableData.id)}
                          disabled={layout.readOnly}
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    }
                    position="rightTop"
                    showArrow
                    trigger="click"
                    style={{ width: "200px", wordBreak: "break-word" }}
                  >
                    <Button
                      icon={<IconMore />}
                      type="tertiary"
                      size="small"
                      style={{
                        backgroundColor: "#475569cc",
                        color: "white",
                      }}
                    />
                  </Popover>
                </div>
              </div>
            </div>
            {tableData.comment && settings.showComments && (
              <div className="text-xs px-3 line-clamp-5">
                {tableData.comment}
              </div>
            )}
          </div>

          {tableData.fields.map((e, i) => {
            const resolved = resolveType(database, e.type);
            const fieldKey = e.id ?? `${tableData.id}-${i}`;
            return showFieldSummaryPopover ? (
              <Popover
                key={fieldKey}
                content={
                  <div className="popover-theme">
                    <div
                      className="flex justify-between items-center pb-2"
                      style={{ direction: "ltr" }}
                    >
                      <p className="me-4 font-bold">{e.name}</p>
                      <p className={`ms-4 font-mono ${dataTypeTextClass}`}>
                        {e.type +
                          ((resolved.isSized || resolved.hasPrecision) &&
                          e.size &&
                          e.size !== ""
                            ? "(" + e.size + ")"
                            : "")}
                      </p>
                    </div>
                    <hr />
                    {e.primary && (
                      <Tag color="blue" className="me-2 my-2">
                        {t("primary")}
                      </Tag>
                    )}
                    {e.unique && (
                      <Tag color="amber" className="me-2 my-2">
                        {t("unique")}
                      </Tag>
                    )}
                    {e.notNull && (
                      <Tag color="purple" className="me-2 my-2">
                        {t("not_null")}
                      </Tag>
                    )}
                    {e.increment && (
                      <Tag color="green" className="me-2 my-2">
                        {t("autoincrement")}
                      </Tag>
                    )}
                    <p>
                      <strong>{t("default_value")}: </strong>
                      {e.default === "" ? t("not_set") : e.default}
                    </p>
                    <p>
                      <strong>{t("comment")}: </strong>
                      {e.comment === "" ? t("not_set") : e.comment}
                    </p>
                  </div>
                }
                position="right"
                showArrow
                style={
                  isRtl(i18n.language)
                    ? { direction: "rtl" }
                    : { direction: "ltr" }
                }
              >
                {field(e, i, fieldKey)}
              </Popover>
            ) : (
              field(e, i, fieldKey)
            );
          })}
        </div>
      </foreignObject>
      <SideSheet
        title={t("edit")}
        size="small"
        visible={
          selectedElement.element === ObjectType.TABLE &&
          selectedElement.id === tableData.id &&
          selectedElement.open &&
          !layout.sidebar
        }
        onCancel={() =>
          setSelectedElement((prev) => ({
            ...prev,
            open: !prev.open,
          }))
        }
        style={{ paddingBottom: "16px" }}
      >
        <div className="sidesheet-theme">
          <TableInfo data={tableData} />
        </div>
      </SideSheet>
    </>
  );

  function field(fieldData, index, key) {
    const fieldResolved = resolveType(database, fieldData.type);
    return (
      <div
        key={key}
        className={`${
          index === tableData.fields.length - 1
            ? ""
            : `border-b ${tableFieldBorderClass}`
        } group h-[36px] w-full overflow-hidden px-2 py-1 flex items-center justify-between gap-1`}
        onPointerEnter={(e) => {
          if (!e.isPrimary) return;

          setHoveredField(index);
          setHoveredTable({
            tableId: tableData.id,
            fieldId: fieldData.id,
          });
        }}
        onPointerLeave={(e) => {
          if (!e.isPrimary) return;

          setHoveredField(null);
          setHoveredTable({
            tableId: null,
            fieldId: null,
          });
        }}
        onPointerDown={(e) => {
          // Required for onPointerLeave to trigger when a touch pointer leaves
          // https://stackoverflow.com/a/70976017/1137077
          e.target.releasePointerCapture(e.pointerId);
        }}
      >
        <div
          className={`${
            hoveredField === index ? "text-zinc-400" : ""
          } flex items-center gap-2 overflow-hidden`}
        >
          <button
            aria-label="Create relationship"
            className="h-[16px] w-[2px] shrink-0 bg-transparent transition group-hover:bg-zinc-400"
            onPointerDown={(e) => {
              if (!e.isPrimary) return;

              handleGripField();
              setLinkingLine((prev) => ({
                ...prev,
                startFieldId: fieldData.id,
                startTableId: tableData.id,
                startX: tableData.x + 15,
                startY:
                  tableData.y +
                  index * tableFieldHeight +
                  tableHeaderHeight +
                  tableColorStripHeight +
                  getCommentHeight(
                    tableData.comment,
                    settings.tableWidth,
                    settings.showComments,
                  ) +
                  14,
                endX: tableData.x + 15,
                endY:
                  tableData.y +
                  index * tableFieldHeight +
                  tableHeaderHeight +
                  tableColorStripHeight +
                  getCommentHeight(
                    tableData.comment,
                    settings.tableWidth,
                    settings.showComments,
                  ) +
                  14,
              }));
            }}
          />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {fieldData.name}
          </span>
        </div>
        <div className="text-zinc-400">
          {hoveredField === index ? (
            <Button
              theme="solid"
              size="small"
              style={{
                backgroundColor: "#dc2626cc",
              }}
              icon={<IconMinus />}
              disabled={layout.readOnly}
              onClick={() => {
                if (layout.readOnly) return;
                deleteField(fieldData, tableData.id);
              }}
            />
          ) : settings.showDataTypes ? (
            <div className="flex gap-1 items-center">
              {fieldData.primary && <IconKeyStroked />}
              <span className={`font-mono ${dataTypeTextClass}`}>
                {fieldData.type +
                  ((fieldResolved.isSized || fieldResolved.hasPrecision) &&
                  fieldData.size &&
                  fieldData.size !== ""
                    ? `(${fieldData.size})`
                    : "")}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default memo(Table, (prevProps, nextProps) => {
  // Custom comparison: only re-render if our specific tableData changed
  if (prevProps.tableData !== nextProps.tableData) return false;
  // Functions are stable thanks to useCallback in parent/context
  if (prevProps.onPointerDown !== nextProps.onPointerDown) return false;
  if (prevProps.setHoveredTable !== nextProps.setHoveredTable) return false;
  if (prevProps.handleGripField !== nextProps.handleGripField) return false;
  if (prevProps.setLinkingLine !== nextProps.setLinkingLine) return false;
  return true;
});
