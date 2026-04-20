import { SideSheet } from "@douyinfe/semi-ui";
import { memo, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Cardinality, ObjectType, Tab } from "../../data/constants";
import { useDiagram, useLayout, useSelect, useSettings } from "../../hooks";
import { calcPath } from "../../utils/calcPath";
import RelationshipInfo from "../EditorSidePanel/RelationshipsTab/RelationshipInfo";

const labelFontSize = 16;

function Relationship({ data }) {
  const { settings } = useSettings();
  const { tables } = useDiagram();
  const { layout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { t } = useTranslation();

  // Only extract the two tables this relationship cares about
  const startTable = useMemo(
    () => tables.find((t) => t.id === data.startTableId),
    [tables, data.startTableId],
  );
  const endTable = useMemo(
    () => tables.find((t) => t.id === data.endTableId),
    [tables, data.endTableId],
  );

  const pathValues = useMemo(() => {
    if (!startTable || !endTable || startTable.hidden || endTable.hidden)
      return null;

    return {
      startFieldIndex: startTable.fields.findIndex(
        (f) => f.id === data.startFieldId,
      ),
      endFieldIndex: endTable.fields.findIndex((f) => f.id === data.endFieldId),
      startTable: {
        x: startTable.x,
        y: startTable.y,
        comment: startTable.comment,
      },
      endTable: { x: endTable.x, y: endTable.y, comment: endTable.comment },
    };
  }, [
    startTable?.x,
    startTable?.y,
    startTable?.hidden,
    startTable?.comment,
    startTable?.fields,
    endTable?.x,
    endTable?.y,
    endTable?.hidden,
    endTable?.comment,
    endTable?.fields,
    data.startFieldId,
    data.endFieldId,
  ]);

  const pathRef = useRef();
  const labelRef = useRef();

  let cardinalityStart = "one";
  let cardinalityEnd = "one";

  switch (data.cardinality) {
    // the translated values are to ensure backwards compatibility
    case t(Cardinality.MANY_TO_ONE):
    case Cardinality.MANY_TO_ONE:
      cardinalityStart = "many";
      cardinalityEnd = "one";
      break;
    case t(Cardinality.ONE_TO_MANY):
    case Cardinality.ONE_TO_MANY:
      cardinalityStart = "one";
      cardinalityEnd = "many";
      break;
    case t(Cardinality.ONE_TO_ONE):
    case Cardinality.ONE_TO_ONE:
      cardinalityStart = "one";
      cardinalityEnd = "one";
      break;
    default:
      break;
  }

  let cardinalityStartX = 0;
  let cardinalityEndX = 0;
  let cardinalityStartY = 0;
  let cardinalityEndY = 0;
  let cardinalityStartDx = 1;
  let cardinalityStartDy = 0;
  let cardinalityEndDx = 1;
  let cardinalityEndDy = 0;
  let labelX = 0;
  let labelY = 0;

  let labelWidth = labelRef.current?.getBBox().width ?? 0;
  let labelHeight = labelRef.current?.getBBox().height ?? 0;

  const cardinalityOffset = 28;

  if (pathRef.current) {
    const pathLength = pathRef.current.getTotalLength();
    const tangentSample = Math.min(10, Math.max(pathLength / 6, 2));

    const labelPoint = pathRef.current.getPointAtLength(pathLength / 2);
    labelX = labelPoint.x - (labelWidth ?? 0) / 2;
    labelY = labelPoint.y + (labelHeight ?? 0) / 2;

    const startLen = Math.min(cardinalityOffset, pathLength);
    const endLen = Math.max(pathLength - cardinalityOffset, 0);

    const point1 = pathRef.current.getPointAtLength(startLen);
    cardinalityStartX = point1.x;
    cardinalityStartY = point1.y;

    const startNext = pathRef.current.getPointAtLength(
      Math.min(startLen + tangentSample, pathLength),
    );
    cardinalityStartDx = point1.x - startNext.x;
    cardinalityStartDy = point1.y - startNext.y;

    const point2 = pathRef.current.getPointAtLength(endLen);
    cardinalityEndX = point2.x;
    cardinalityEndY = point2.y;

    const endPrev = pathRef.current.getPointAtLength(
      Math.max(endLen - tangentSample, 0),
    );
    cardinalityEndDx = point2.x - endPrev.x;
    cardinalityEndDy = point2.y - endPrev.y;
  }

  const edit = useCallback(() => {
    if (!layout.sidebar) {
      setSelectedElement((prev) => ({
        ...prev,
        element: ObjectType.RELATIONSHIP,
        id: data.id,
        open: true,
      }));
    } else {
      setSelectedElement((prev) => ({
        ...prev,
        currentTab: Tab.RELATIONSHIPS,
        element: ObjectType.RELATIONSHIP,
        id: data.id,
        open: true,
      }));
      if (selectedElement.currentTab !== Tab.RELATIONSHIPS) return;
      document
        .getElementById(`scroll_ref_${data.id}`)
        .scrollIntoView({ behavior: "smooth" });
    }
  }, [layout.sidebar, data.id, selectedElement.currentTab, setSelectedElement]);

  if (!pathValues) return null;

  const pathD = calcPath(
    pathValues,
    settings.tableWidth,
    1,
    settings.showComments,
  );

  return (
    <>
      <g className="select-none group" onDoubleClick={edit}>
        {/* invisible wider path for better hover ux */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={12}
          cursor="pointer"
        />
        <path
          ref={pathRef}
          d={pathD}
          className="relationship-path-modern"
          fill="none"
          cursor="pointer"
        />
        {settings.showRelationshipLabels && (
          <text
            x={labelX}
            y={labelY}
            fill={settings.mode === "dark" ? "lightgrey" : "#333"}
            fontSize={labelFontSize}
            fontWeight={500}
            ref={labelRef}
            className="group-hover:fill-sky-600"
          >
            {data.name}
          </text>
        )}
        {pathRef.current && settings.showCardinality && (
          <>
            <CardinalityGlyph
              x={cardinalityStartX}
              y={cardinalityStartY}
              kind={cardinalityStart}
              dx={cardinalityStartDx}
              dy={cardinalityStartDy}
              darkMode={settings.mode === "dark"}
            />
            <CardinalityGlyph
              x={cardinalityEndX}
              y={cardinalityEndY}
              kind={cardinalityEnd}
              dx={cardinalityEndDx}
              dy={cardinalityEndDy}
              darkMode={settings.mode === "dark"}
            />
          </>
        )}
      </g>
      <SideSheet
        title={t("edit")}
        size="small"
        visible={
          selectedElement.element === ObjectType.RELATIONSHIP &&
          selectedElement.id === data.id &&
          selectedElement.open &&
          !layout.sidebar
        }
        onCancel={() => {
          setSelectedElement((prev) => ({
            ...prev,
            open: false,
          }));
        }}
        style={{ paddingBottom: "16px" }}
      >
        <div className="sidesheet-theme">
          <RelationshipInfo data={data} />
        </div>
      </SideSheet>
    </>
  );
}

const MemoizedRelationship = memo(Relationship);
export default MemoizedRelationship;

const CardinalityGlyph = memo(function CardinalityGlyph({
  x,
  y,
  kind,
  dx,
  dy,
  darkMode,
}) {
  const stroke = darkMode ? "#cbd5e1" : "#1f2937";
  const vectorLength = Math.hypot(dx, dy) || 1;
  const nx = dx / vectorLength;
  const ny = dy / vectorLength;
  const px = -ny;
  const py = nx;

  const stem = darkMode ? 12 : 11;
  const spread = darkMode ? 8.5 : 7.5;
  const thickness = darkMode ? 2.4 : 2.1;

  if (kind === "many") {
    const baseX = x - nx * stem;
    const baseY = y - ny * stem;

    return (
      <g>
        <line
          x1={baseX}
          y1={baseY}
          x2={x + px * spread}
          y2={y + py * spread}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="square"
          className="group-hover:stroke-sky-600"
        />
        <line
          x1={baseX}
          y1={baseY}
          x2={x}
          y2={y}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="square"
          className="group-hover:stroke-sky-600"
        />
        <line
          x1={baseX}
          y1={baseY}
          x2={x - px * spread}
          y2={y - py * spread}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="square"
          className="group-hover:stroke-sky-600"
        />
      </g>
    );
  }

  return (
    <g>
      <line
        x1={x + px * spread}
        y1={y + py * spread}
        x2={x - px * spread}
        y2={y - py * spread}
        stroke={stroke}
        strokeWidth={thickness}
        strokeLinecap="square"
        className="group-hover:stroke-sky-600"
      />
    </g>
  );
});
