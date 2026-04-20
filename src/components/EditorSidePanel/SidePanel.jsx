import { IconCode } from "@douyinfe/semi-icons";
import { Button, Divider, TabPane, Tabs, Tooltip } from "@douyinfe/semi-ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tab } from "../../data/constants";
import { databases } from "../../data/databases";
import {
  useAreas,
  useDiagram,
  useEnums,
  useLayout,
  useNotes,
  useSelect,
  useTypes,
} from "../../hooks";
import i18n from "../../i18n/i18n";
import { isRtl } from "../../i18n/utils/rtl";
import AreasTab from "./AreasTab/AreasTab";
import DBMLEditor from "./DBMLEditor";
import EnumsTab from "./EnumsTab/EnumsTab";
import Issues from "./Issues";
import NotesTab from "./NotesTab/NotesTab";
import RelationshipsTab from "./RelationshipsTab/RelationshipsTab";
import TablesTab from "./TablesTab/TablesTab";
import TypesTab from "./TypesTab/TypesTab";

export default function SidePanel({ width, resize, setResize }) {
  const { layout, setLayout } = useLayout();
  const { selectedElement, setSelectedElement } = useSelect();
  const { database, tablesCount, relationshipsCount } = useDiagram();
  const { areasCount } = useAreas();
  const { notesCount } = useNotes();
  const { typesCount } = useTypes();
  const { enumsCount } = useEnums();
  const { t } = useTranslation();

  const toggleDBMLEditor = () => {
    setLayout((prev) => ({ ...prev, dbmlEditor: !prev.dbmlEditor }));
  };

  const tabList = useMemo(() => {
    const tabs = [
      {
        tab: `${t("tables")} (${tablesCount})`,
        itemKey: Tab.TABLES,
        component: <TablesTab />,
      },
      {
        tab: `${t("relationships")} (${relationshipsCount})`,
        itemKey: Tab.RELATIONSHIPS,
        component: <RelationshipsTab />,
      },
      {
        tab: `${t("subject_areas")} (${areasCount})`,
        itemKey: Tab.AREAS,
        component: <AreasTab />,
      },
      {
        tab: `${t("notes")} (${notesCount})`,
        itemKey: Tab.NOTES,
        component: <NotesTab />,
      },
    ];

    if (databases[database].hasTypes) {
      tabs.push({
        tab: `${t("types")} (${typesCount})`,
        itemKey: Tab.TYPES,
        component: <TypesTab />,
      });
    }

    if (databases[database].hasEnums) {
      tabs.push({
        tab: `${t("enums")} (${enumsCount})`,
        itemKey: Tab.ENUMS,
        component: <EnumsTab />,
      });
    }

    return isRtl(i18n.language) ? tabs.reverse() : tabs;
  }, [
    t,
    database,
    tablesCount,
    relationshipsCount,
    areasCount,
    typesCount,
    enumsCount,
    notesCount,
  ]);

  return (
    <div className="flex h-full">
      <div
        className="relative flex h-full flex-col border-r border-zinc-200 bg-zinc-50/60"
        style={{ width: `${width}px` }}
      >
        <div className="h-full flex-1 overflow-y-auto">
          {layout.dbmlEditor ? (
            <DBMLEditor />
          ) : (
            <Tabs
              type="card"
              activeKey={selectedElement.currentTab}
              lazyRender
              keepDOM={false}
              onChange={(key) =>
                setSelectedElement((prev) => ({ ...prev, currentTab: key }))
              }
              collapsible
              tabBarStyle={{ direction: "ltr" }}
              className="[&_.semi-tabs-bar]:border-b-zinc-200"
              tabBarExtraContent={
                <>
                  <Divider layout="vertical" />
                  <Tooltip content={t("dbml_view")} position="bottom">
                    <Button
                      onClick={toggleDBMLEditor}
                      icon={<IconCode />}
                      theme="borderless"
                    />
                  </Tooltip>
                </>
              }
            >
              {tabList.length &&
                tabList.map((tab) => (
                  <TabPane
                    tab={tab.tab}
                    itemKey={tab.itemKey}
                    key={tab.itemKey}
                  >
                    <div className="p-3">{tab.component}</div>
                  </TabPane>
                ))}
            </Tabs>
          )}
        </div>
        {layout.issues && (
          <div className="mt-auto border-t border-zinc-200 bg-white">
            <Issues />
          </div>
        )}
      </div>
      <div
        className={`flex h-auto cursor-col-resize items-center justify-center border-r border-zinc-200 bg-white px-1 ${
          resize ? "bg-zinc-100" : "hover:bg-zinc-50"
        }`}
        onPointerDown={(e) => e.isPrimary && setResize(true)}
      >
        <div className="h-10 w-1 border-x border-zinc-300" />
      </div>
    </div>
  );
}
