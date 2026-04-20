import { Divider, Tooltip } from "@douyinfe/semi-ui";
import { useTranslation } from "react-i18next";
import { useLayout, useTransform } from "../hooks";
import { exitFullscreen } from "../utils/fullscreen";

export default function FloatingControls() {
  const { transform, setTransform } = useTransform();
  const { setLayout } = useLayout();
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <div className="flex items-center border border-zinc-200 bg-white">
        <button
          className="px-3 py-2 text-zinc-700 hover:bg-zinc-100"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              zoom: prev.zoom / 1.2,
            }))
          }
        >
          <i className="bi bi-dash-lg" />
        </button>
        <Divider align="center" layout="vertical" />
        <div className="px-3 py-2 text-sm font-medium text-zinc-700">
          {parseInt(transform.zoom * 100)}%
        </div>
        <Divider align="center" layout="vertical" />
        <button
          className="px-3 py-2 text-zinc-700 hover:bg-zinc-100"
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              zoom: prev.zoom * 1.2,
            }))
          }
        >
          <i className="bi bi-plus-lg" />
        </button>
      </div>
      <Tooltip content={t("exit")}>
        <button
          className="border border-zinc-200 bg-white px-3 py-2 text-zinc-700 hover:bg-zinc-100"
          onClick={() => {
            setLayout((prev) => ({
              ...prev,
              sidebar: true,
              toolbar: true,
              header: true,
            }));
            exitFullscreen();
          }}
        >
          <i className="bi bi-fullscreen-exit" />
        </button>
      </Tooltip>
    </div>
  );
}
