import { IconSearch } from "@douyinfe/semi-icons";
import { AutoComplete } from "@douyinfe/semi-ui";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ObjectType } from "../../../data/constants";
import { useSelect } from "../../../hooks";

export default function SearchBar({ tables }) {
  const { setSelectedElement } = useSelect();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");

  const searchableItems = useMemo(() => {
    return tables.flatMap(({ id, name, fields = [] }) => [
      {
        label: name,
        tableId: id,
        fieldIndex: null,
      },
      ...fields.map((field, index) => ({
        label: `${name}.${field.name}`,
        tableId: id,
        fieldIndex: index,
      })),
    ]);
  }, [tables]);

  const [filteredResult, setFilteredResult] = useState(
    searchableItems.map((item) => item.label),
  );

  useEffect(() => {
    setFilteredResult(searchableItems.map((item) => item.label));
  }, [searchableItems]);

  const handleStringSearch = (value) => {
    const searchValue = value.toLowerCase();
    setFilteredResult(
      searchableItems
        .map((item) => item.label)
        .filter((itemLabel) => itemLabel.toLowerCase().includes(searchValue)),
    );
  };

  return (
    <AutoComplete
      data={filteredResult}
      value={searchText}
      showClear
      prefix={<IconSearch />}
      emptyContent={<div className="p-3 popover-theme">{t("not_found")}</div>}
      placeholder={t("search")}
      onSearch={handleStringSearch}
      onChange={(v) => setSearchText(v)}
      onSelect={(value) => {
        const found = searchableItems.find((item) => item.label === value);
        if (!found) return;
        const { tableId, fieldIndex } = found;

        setSelectedElement((prev) => ({
          ...prev,
          id: tableId,
          open: true,
          element: ObjectType.TABLE,
        }));
        document
          .getElementById(`scroll_table_${tableId}`)
          .scrollIntoView({ behavior: "smooth" });

        if (fieldIndex !== null) {
          document
            .getElementById(`scroll_table_${tableId}_input_${fieldIndex}`)
            ?.focus();
        }
      }}
      className="w-full"
    />
  );
}
