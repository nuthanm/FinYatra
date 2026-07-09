"use client";

import { FyIcon } from "@/components/FyIcon";
import { useT } from "@/components/providers/I18nProvider";

type SlideField = { label: string; value: string };
type Slide = {
  cssClass: string;
  icon: string;
  title: string;
  subtitle: string;
  fields: SlideField[];
  resultLabel: string;
  resultValue: string;
  chartSvg: string;
};

export function HeroDashboardPreview() {
  const t = useT();

  const slides: Slide[] = [
    {
      cssClass: "fy-hero-showcase-slide--goal",
      icon: "target",
      title: t("Nav_GoalPlanner"),
      subtitle: t("Tool_goal_Subtitle"),
      fields: [
        { label: t("Tool_goal_LabelTarget"), value: "₹10,00,000" },
        { label: t("Tool_goal_LabelHorizon"), value: `5 ${t("Common_Label_Years")}` },
      ],
      resultLabel: t("Common_Label_MonthlySaving"),
      resultValue: "₹16,400",
      chartSvg: '<svg viewBox="0 0 120 40"><polyline class="fy-hero-showcase-line" points="0,34 24,28 48,22 72,16 96,10 120,6"/></svg>',
    },
    {
      cssClass: "fy-hero-showcase-slide--sip",
      icon: "trending-up",
      title: t("Tool_sip_Title"),
      subtitle: t("Tool_sip_Subtitle"),
      fields: [
        { label: t("Tool_sip_LabelSip"), value: "₹10,000" },
        { label: t("Common_Label_TenureYears"), value: `10 ${t("Common_Label_Years")}` },
      ],
      resultLabel: t("Common_Label_FutureValue"),
      resultValue: "₹22.9 L",
      chartSvg: '<svg viewBox="0 0 120 40"><polyline class="fy-hero-showcase-line" points="0,34 20,30 40,24 60,18 80,12 100,8 120,4"/></svg>',
    },
    {
      cssClass: "fy-hero-showcase-slide--fire",
      icon: "flame",
      title: t("Nav_Fire"),
      subtitle: t("Tool_fire_Subtitle"),
      fields: [
        { label: t("Tool_fire_LabelCurrentAge"), value: "30" },
        { label: t("Tool_fire_LabelRetirementAge"), value: "50" },
      ],
      resultLabel: t("Tool_fire_Result_TargetCorpus"),
      resultValue: "₹3.99 Cr",
      chartSvg: '<svg viewBox="0 0 120 40"><polyline class="fy-hero-showcase-line" points="0,34 30,26 60,18 90,10 120,4"/></svg>',
    },
    {
      cssClass: "fy-hero-showcase-slide--fd",
      icon: "layers",
      title: t("Nav_FdLaddering"),
      subtitle: t("Tool_fd_Subtitle"),
      fields: [
        { label: t("Tool_fd_LabelAmount"), value: "₹5,00,000" },
        { label: t("Tool_fd_LabelCount"), value: "5" },
      ],
      resultLabel: t("Common_Col_Maturity"),
      resultValue: "₹1.25L",
      chartSvg:
        '<svg viewBox="0 0 120 40"><rect class="fy-hero-showcase-bar" x="4" y="22" width="18" height="14" rx="2"/><rect class="fy-hero-showcase-bar" x="28" y="16" width="18" height="20" rx="2"/><rect class="fy-hero-showcase-bar" x="52" y="10" width="18" height="26" rx="2"/><rect class="fy-hero-showcase-bar" x="76" y="6" width="18" height="30" rx="2"/><rect class="fy-hero-showcase-bar" x="100" y="2" width="16" height="34" rx="2"/></svg>',
    },
  ];

  const first = slides[0];

  const renderSlide = (slide: Slide, key: string) => (
    <article key={key} className={`fy-hero-showcase-slide ${slide.cssClass}`}>
      <header className="fy-hero-showcase-head">
        <span className="fy-hero-showcase-icon">
          <FyIcon name={slide.icon} size={18} />
        </span>
        <div>
          <h3>{slide.title}</h3>
          <p>{slide.subtitle}</p>
        </div>
      </header>
      <div className="fy-hero-showcase-fields">
        {slide.fields.map((field) => (
          <div key={field.label} className="fy-hero-showcase-field">
            <span>{field.label}</span>
            <strong>{field.value}</strong>
          </div>
        ))}
      </div>
      <div className="fy-hero-showcase-result">
        <span>{slide.resultLabel}</span>
        <strong>{slide.resultValue}</strong>
      </div>
      <div className="fy-hero-showcase-chart" aria-hidden dangerouslySetInnerHTML={{ __html: slide.chartSvg }} />
    </article>
  );

  return (
    <div className="fy-hero-showcase" aria-hidden>
      <div className="fy-hero-showcase-viewport">
        <div className="fy-hero-showcase-track">
          {slides.map((slide) => renderSlide(slide, slide.cssClass))}
          {renderSlide(first, `${first.cssClass}-clone`)}
        </div>
      </div>
      <div className="fy-hero-showcase-dots" aria-hidden>
        <span className="fy-hero-showcase-dot fy-hero-showcase-dot--1" />
        <span className="fy-hero-showcase-dot fy-hero-showcase-dot--2" />
        <span className="fy-hero-showcase-dot fy-hero-showcase-dot--3" />
        <span className="fy-hero-showcase-dot fy-hero-showcase-dot--4" />
      </div>
    </div>
  );
}
