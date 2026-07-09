"use client";

import { FyIcon } from "@/components/FyIcon";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useT } from "@/components/providers/I18nProvider";
import type { ToolLink } from "@/lib/types";
import { groupLabelKey } from "@/lib/config/tools";
import Link from "next/link";

export function ViewToggle() {
  const t = useT();
  const { toolView, setToolView } = useAppState();

  return (
    <div className="fy-viewtoggle" role="group" aria-label={t("View_ChooseLayout")}>
      <button
        type="button"
        className={`fy-viewtoggle-btn${toolView === "tiles" ? " active" : ""}`}
        onClick={() => setToolView("tiles")}
        aria-pressed={toolView === "tiles"}
      >
        <FyIcon name="grid" size={16} /> <span>{t("View_Tiles")}</span>
      </button>
      <button
        type="button"
        className={`fy-viewtoggle-btn${toolView === "list" ? " active" : ""}`}
        onClick={() => setToolView("list")}
        aria-pressed={toolView === "list"}
      >
        <FyIcon name="list" size={16} /> <span>{t("View_List")}</span>
      </button>
    </div>
  );
}

export function ToolCollection({ tools }: { tools: ToolLink[] }) {
  const t = useT();
  const { toolView } = useAppState();

  if (!tools.length) {
    return <div className="fy-empty-note">{t("Tools_NoTools")}</div>;
  }

  if (toolView === "list") {
    return (
      <div className="fy-tools-listview">
        {tools.map((tool) => (
          <Link
            key={tool.key}
            href={tool.route}
            className={`fy-tool-row${tool.comingSoon ? " fy-tool-soon" : ""}`}
            aria-disabled={tool.comingSoon}
          >
            <span className="fy-tool-row-icon">
              <FyIcon name={tool.icon} size={22} />
            </span>
            <span className="fy-tool-row-body">
              <span className="fy-tool-row-title">
                {t(tool.titleKey)}
                {tool.comingSoon ? <span className="fy-side-soon">{t("Label_Soon")}</span> : null}
              </span>
              <span className="fy-tool-row-desc">{t(tool.descriptionKey)}</span>
            </span>
            <span className="fy-tool-row-meta">{t(groupLabelKey(tool.group))}</span>
            <span className="fy-tool-row-go">
              <FyIcon name="chevron-right" size={18} />
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="fy-tools-grid">
      {tools.map((tool) => (
        <Link
          key={tool.key}
          href={tool.route}
          className={`fy-tool-card${tool.comingSoon ? " fy-tool-soon" : ""}`}
          aria-disabled={tool.comingSoon}
        >
          <span className="fy-tool-card-icon">
            <FyIcon name={tool.icon} size={24} />
          </span>
          <div className="fy-tool-card-body">
            <h2>{t(tool.titleKey)}</h2>
            <p>{t(tool.descriptionKey)}</p>
          </div>
          <div className="fy-tool-card-meta">
            {tool.comingSoon ? t("Tools_ComingSoon") : t(groupLabelKey(tool.group))}
          </div>
        </Link>
      ))}
    </div>
  );
}
