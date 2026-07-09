"use client";

import Link from "next/link";
import { useT } from "@/components/providers/I18nProvider";
import { useAppState } from "@/components/providers/AppStateProvider";
import { ToolPageShell } from "@/components/calculator/CalculatorUi";
import { FyIcon } from "@/components/FyIcon";
import { TOOLS, getTool, groupLabelKey } from "@/lib/config/tools";

type ComingSoonPageProps = {
  toolKey: string;
};

export function ComingSoonPage({ toolKey }: ComingSoonPageProps) {
  const t = useT();
  const { toolView, setToolView } = useAppState();
  const tool = getTool(toolKey);
  const title = tool ? t(tool.titleKey) : t("Page_ComingSoon_NewTool");
  const availableTools = TOOLS.filter((item) => !item.comingSoon);

  return (
    <ToolPageShell
      title={title}
      subtitle={t("Page_ComingSoon_Subtitle")}
      description={t("Page_ComingSoon_Description")}
      icon="grid"
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Page_ComingSoon_NextHeading")}</strong>
            <p>{t("Page_ComingSoon_NextBody")}</p>
          </div>
          <div className="fy-info-box">
            <strong>{t("Page_ComingSoon_RequestHeading")}</strong>
            <p>
              {t("Page_ComingSoon_RequestBody")}{" "}
              <a className="fy-inline-link" href="mailto:inbox.nuthan@gmail.com">
                inbox.nuthan@gmail.com
              </a>
              .
            </p>
          </div>
        </>
      }
    >
      <div className="fy-form-card fy-comingsoon-card">
        <div className="fy-comingsoon-head">
          <div>
            <h3>{t("Page_ComingSoon_AvailableHeading")}</h3>
            <p className="fy-comingsoon-sub">{t("Page_ComingSoon_LayoutHint")}</p>
          </div>
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
        </div>

        {toolView === "list" ? (
          <div className="fy-tools-listview">
            {availableTools.map((item) => (
              <Link key={item.key} className="fy-tool-row" href={item.route}>
                <span className="fy-tool-row-icon">
                  <FyIcon name={item.icon} size={22} />
                </span>
                <span className="fy-tool-row-body">
                  <span className="fy-tool-row-title">{t(item.titleKey)}</span>
                  <span className="fy-tool-row-desc">{t(item.descriptionKey)}</span>
                </span>
                <span className="fy-tool-row-meta">{t(groupLabelKey(item.group))}</span>
                <span className="fy-tool-row-go">
                  <FyIcon name="chevron-right" size={18} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="fy-tools-grid">
            {availableTools.map((item) => (
              <Link key={item.key} className="fy-tool-card" href={item.route}>
                <span className="fy-tool-card-icon">
                  <FyIcon name={item.icon} size={24} />
                </span>
                <div className="fy-tool-card-body">
                  <h2>{t(item.titleKey)}</h2>
                  <p>{t(item.descriptionKey)}</p>
                </div>
                <div className="fy-tool-card-meta">{t(groupLabelKey(item.group))}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
