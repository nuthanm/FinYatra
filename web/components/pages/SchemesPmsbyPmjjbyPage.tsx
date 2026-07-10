"use client";

import Link from "next/link";
import { ToolPageShell } from "@/components/calculator/CalculatorUi";
import { useT } from "@/components/providers/I18nProvider";
import {
  ESHRAM_PMJJBY_COVER,
  ESHRAM_PMJJBY_PREMIUM,
  ESHRAM_PMSBY_COVER,
  ESHRAM_PMSBY_PREMIUM,
} from "@/lib/finance/eShram";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function FaqCard({ qKey, aKey }: { qKey: string; aKey: string }) {
  const t = useT();
  return (
    <details className="fy-faq-item">
      <summary className="fy-faq-q">{t(qKey)}</summary>
      <p className="fy-faq-a">{t(aKey)}</p>
    </details>
  );
}

export function SchemesPmsbyPmjjbyPage() {
  const t = useT();
  const pmsbyPremium = INR.format(ESHRAM_PMSBY_PREMIUM);
  const pmsbyCover = INR.format(ESHRAM_PMSBY_COVER);
  const pmjjbyPremium = INR.format(ESHRAM_PMJJBY_PREMIUM);
  const pmjjbyCover = INR.format(ESHRAM_PMJJBY_COVER);
  const combinedPremium = INR.format(ESHRAM_PMSBY_PREMIUM + ESHRAM_PMJJBY_PREMIUM);

  return (
    <ToolPageShell
      title={t("Page_PmsbyPmjjby_Title")}
      subtitle={t("Page_PmsbyPmjjby_Subtitle")}
      description={t("Page_PmsbyPmjjby_Description")}
      icon="shield"
    >
      <p className="fy-policy-updated">{t("Page_PmsbyPmjjby_EduNote")}</p>

      <div className="fy-scheme-compare">
        <div className="fy-form-card fy-scheme-card">
          <p className="fy-scheme-eyebrow">{t("Page_PmsbyPmjjby_PmsbyEyebrow")}</p>
          <h3>{t("Page_PmsbyPmjjby_PmsbyName")}</h3>
          <p className="fy-audience">{t("Page_PmsbyPmjjby_PmsbyAbout")}</p>
          <ul className="fy-info-list">
            <li>{t("Page_PmsbyPmjjby_PmsbyPremium", pmsbyPremium)}</li>
            <li>{t("Page_PmsbyPmjjby_PmsbyCover", pmsbyCover)}</li>
            <li>{t("Page_PmsbyPmjjby_PmsbyAge")}</li>
            <li>{t("Page_PmsbyPmjjby_PmsbyPeriod")}</li>
          </ul>
        </div>
        <div className="fy-form-card fy-scheme-card">
          <p className="fy-scheme-eyebrow">{t("Page_PmsbyPmjjby_PmjjbyEyebrow")}</p>
          <h3>{t("Page_PmsbyPmjjby_PmjjbyName")}</h3>
          <p className="fy-audience">{t("Page_PmsbyPmjjby_PmjjbyAbout")}</p>
          <ul className="fy-info-list">
            <li>{t("Page_PmsbyPmjjby_PmjjbyPremium", pmjjbyPremium)}</li>
            <li>{t("Page_PmsbyPmjjby_PmjjbyCover", pmjjbyCover)}</li>
            <li>{t("Page_PmsbyPmjjby_PmjjbyAge")}</li>
            <li>{t("Page_PmsbyPmjjby_PmjjbyPeriod")}</li>
          </ul>
        </div>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_PmsbyPmjjby_TogetherTitle")}</h3>
        <p className="fy-audience">
          {t("Page_PmsbyPmjjby_TogetherBody", combinedPremium, pmsbyCover, pmjjbyCover)}
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_PmsbyPmjjby_FaqHeading")}</h3>
        <div className="fy-faq-list">
          <FaqCard qKey="Page_PmsbyPmjjby_Q01" aKey="Page_PmsbyPmjjby_A01" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q02" aKey="Page_PmsbyPmjjby_A02" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q03" aKey="Page_PmsbyPmjjby_A03" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q04" aKey="Page_PmsbyPmjjby_A04" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q05" aKey="Page_PmsbyPmjjby_A05" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q06" aKey="Page_PmsbyPmjjby_A06" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q07" aKey="Page_PmsbyPmjjby_A07" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q08" aKey="Page_PmsbyPmjjby_A08" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q09" aKey="Page_PmsbyPmjjby_A09" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q10" aKey="Page_PmsbyPmjjby_A10" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q11" aKey="Page_PmsbyPmjjby_A11" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q12" aKey="Page_PmsbyPmjjby_A12" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q13" aKey="Page_PmsbyPmjjby_A13" />
          <FaqCard qKey="Page_PmsbyPmjjby_Q14" aKey="Page_PmsbyPmjjby_A14" />
        </div>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_PmsbyPmjjby_HowToTitle")}</h3>
        <ol className="fy-info-list fy-info-list-ordered">
          <li>{t("Page_PmsbyPmjjby_HowTo1")}</li>
          <li>{t("Page_PmsbyPmjjby_HowTo2")}</li>
          <li>{t("Page_PmsbyPmjjby_HowTo3")}</li>
          <li>{t("Page_PmsbyPmjjby_HowTo4")}</li>
        </ol>
        <p className="fy-audience" style={{ marginTop: "0.85rem" }}>
          {t("Page_PmsbyPmjjby_OfficialHint")}{" "}
          <a
            className="fy-inline-link"
            href="https://www.jansuraksha.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Page_PmsbyPmjjby_OfficialLink")}
          </a>
          .
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_PmsbyPmjjby_NextTitle")}</h3>
        <p className="fy-audience">{t("Page_PmsbyPmjjby_NextBody")}</p>
        <div className="fy-scheme-cta-row">
          <Link className="fy-btn fy-btn-primary" href="/calc/health-insurance">
            {t("Page_PmsbyPmjjby_CtaHealth")}
          </Link>
          <Link className="fy-btn fy-btn-secondary" href="/calc/term-insurance">
            {t("Page_PmsbyPmjjby_CtaTerm")}
          </Link>
          <Link className="fy-btn fy-btn-secondary" href="/calc/e-shram">
            {t("Page_PmsbyPmjjby_CtaEshram")}
          </Link>
        </div>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_PmsbyPmjjby_DisclaimerTitle")}</h3>
        <p className="fy-audience">{t("Page_PmsbyPmjjby_DisclaimerBody")}</p>
      </div>
    </ToolPageShell>
  );
}
