"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import { CONTACT_EMAIL } from "@/lib/config/site";
import { ToolPageShell } from "@/components/calculator/CalculatorUi";
import { isValidEmail, MIN_MESSAGE_LENGTH } from "@/lib/contact/validation";

const REQUEST_TYPES = [
  "Bug report",
  "Feature request",
  "Calculator feedback",
  "Translation improvement",
  "Partnership / advertising",
  "Other",
] as const;

const REQUEST_TYPE_KEYS: Record<(typeof REQUEST_TYPES)[number], string> = {
  "Bug report": "Page_Contact_RequestType_Bug",
  "Feature request": "Page_Contact_RequestType_Feature",
  "Calculator feedback": "Page_Contact_RequestType_Feedback",
  "Translation improvement": "Page_Contact_RequestType_Translation",
  "Partnership / advertising": "Page_Contact_RequestType_Partnership",
  Other: "Page_Contact_RequestType_Other",
};

type CaptchaResponse = { challenge: string; token: string; mailAvailable: boolean };

export function ContactPage() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<(typeof REQUEST_TYPES)[number]>("Bug report");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaApiOffline, setCaptchaApiOffline] = useState(false);
  const [mailDeliveryUnavailable, setMailDeliveryUnavailable] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const loadCaptcha = useCallback(async () => {
    setCaptchaError("");
    setCaptchaApiOffline(false);
    try {
      const res = await fetch("/api/contact-captcha");
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.includes("json")) {
        setCaptchaApiOffline(true);
        setCaptchaChallenge("");
        setCaptchaToken("");
        return;
      }
      const data = (await res.json()) as CaptchaResponse;
      setCaptchaChallenge(data.challenge);
      setCaptchaToken(data.token);
      setCaptchaAnswer("");
      setMailDeliveryUnavailable(!data.mailAvailable);
    } catch {
      setCaptchaApiOffline(true);
    }
  }, []);

  useEffect(() => {
    void loadCaptcha();
  }, [loadCaptcha]);

  const submitBlockers = (() => {
    const items: string[] = [];
    if (!name.trim()) items.push(t("Page_Contact_Val_NameRequired"));
    if (!email.trim()) items.push(t("Page_Contact_Val_EmailRequired"));
    else if (!isValidEmail(email.trim())) items.push(t("Page_Contact_Val_EmailInvalid"));
    if (!subject.trim()) items.push(t("Page_Contact_Val_SubjectRequired"));
    if (!message.trim()) items.push(t("Page_Contact_Val_MessageRequired"));
    else if (message.trim().length < MIN_MESSAGE_LENGTH) items.push(t("Page_Contact_Val_MessageMin"));
    if (!consent) items.push(t("Page_Contact_Val_ConsentRequired"));
    if (captchaApiOffline) items.push(t("Page_Contact_Unavailable_Title"));
    else if (mailDeliveryUnavailable) items.push(t("Page_Contact_DeliveryUnavailable_Title"));
    else if (!captchaToken) items.push(t("Page_Contact_Err_CaptchaLoad"));
    else if (!/^\d+$/.test(captchaAnswer.trim())) items.push(t("Page_Contact_Err_CaptchaAnswer"));
    return items;
  })();

  const formStarted = Boolean(
    name.trim() || email.trim() || subject.trim() || message.trim() || consent || captchaAnswer.trim(),
  );

  const canSubmit =
    !submitting &&
    !captchaApiOffline &&
    !mailDeliveryUnavailable &&
    name.trim() &&
    email.trim() &&
    isValidEmail(email.trim()) &&
    subject.trim() &&
    message.trim().length >= MIN_MESSAGE_LENGTH &&
    consent &&
    captchaToken &&
    /^\d+$/.test(captchaAnswer.trim());

  const resetForm = async () => {
    setName("");
    setEmail("");
    setRequestType("Bug report");
    setSubject("");
    setMessage("");
    setConsent(false);
    setHoneypot("");
    setSubmitted(false);
    setSubmittedEmail("");
    setMailDeliveryUnavailable(false);
    setSubmitError("");
    await loadCaptcha();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setCaptchaError("");
    setMailDeliveryUnavailable(false);
    if (honeypot.trim()) {
      setSubmitted(true);
      return;
    }
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          requestType,
          subject: subject.trim(),
          message: message.trim(),
          website: honeypot,
          captchaToken,
          captchaAnswer: Number(captchaAnswer.trim()),
          consent,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setSubmittedEmail(email.trim());
        setSubmitted(true);
        return;
      }
      if (data.error?.toLowerCase().includes("not configured")) {
        setMailDeliveryUnavailable(true);
        return;
      }
      setSubmitError(
        data.error === "Too many requests. Please try later."
          ? t("Page_Contact_Err_TooManyRequests")
          : t("Page_Contact_Err_Submit"),
      );
      if (data.error === "Captcha verification failed.") {
        setCaptchaError(t("Page_Contact_Err_CaptchaWrong"));
      }
      await loadCaptcha();
    } catch {
      setSubmitError(t("Page_Contact_Err_Submit"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ToolPageShell
      title={t("Page_Contact_Title")}
      subtitle={t("Page_Contact_Subtitle")}
      description={t("Page_Contact_Description")}
      icon="mail"
      fullWidth
    >
      <div className="fy-contact-grid">
        <div className="fy-form-card fy-contact-info">
          <h3>{t("Page_Contact_InfoHeading")}</h3>
          <p className="fy-audience">{t("Page_Contact_InfoBody")}</p>
          <div className="fy-contact-lines">
            <div className="fy-contact-line">
              <span className="fy-contact-k">{t("Common_Email")}</span>
              <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="fy-contact-line">
              <span className="fy-contact-k">{t("Page_Contact_LabelResponseTime")}</span>
              <span>{t("Page_Contact_ResponseTimeValue")}</span>
            </div>
            <div className="fy-contact-line">
              <span className="fy-contact-k">{t("Page_Contact_LabelPrivacy")}</span>
              <span>
                {t("Page_Contact_PrivacyText")}{" "}
                <a className="fy-inline-link" href="/privacy">
                  {t("Common_PrivacyPolicy")}
                </a>
                .
              </span>
            </div>
          </div>
        </div>

        <div className="fy-form-card fy-contact-form-card">
          {submitted ? (
            <div className="fy-contact-success">
              <h3>{t("Page_Contact_SuccessHeading")}</h3>
              <p className="fy-audience">
                {t("Page_Contact_SuccessBody")} <strong>{submittedEmail}</strong>
              </p>
              <button type="button" className="fy-btn fy-btn-secondary" onClick={() => void resetForm()}>
                {t("Page_Contact_BtnSendAnother")}
              </button>
            </div>
          ) : (
            <form className="fy-contact-form" onSubmit={onSubmit}>
              <div className="fy-hp" aria-hidden>
                <label htmlFor="contact-website">{t("Page_Contact_HoneypotLabel")}</label>
                <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <div className="fy-field">
                <label htmlFor="contact-name">{t("Page_Contact_LabelName")}</label>
                <input id="contact-name" className="fy-input" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="fy-field">
                <label htmlFor="contact-email">{t("Common_Email")}</label>
                <input id="contact-email" className="fy-input" type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="fy-field">
                <label htmlFor="contact-type">{t("Page_Contact_LabelRequestType")}</label>
                <select id="contact-type" className="fy-input" value={requestType} onChange={(e) => setRequestType(e.target.value as (typeof REQUEST_TYPES)[number])}>
                  {REQUEST_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(REQUEST_TYPE_KEYS[type])}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fy-field">
                <label htmlFor="contact-subject">{t("Page_Contact_LabelSubject")}</label>
                <input id="contact-subject" className="fy-input" maxLength={180} value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="fy-field">
                <label htmlFor="contact-message">{t("Page_Contact_LabelMessage")}</label>
                <textarea id="contact-message" className="fy-input fy-textarea" rows={5} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)} required />
                {message.trim() && message.trim().length < MIN_MESSAGE_LENGTH ? (
                  <span className="validation-message">{t("Page_Contact_Val_MessageMin")}</span>
                ) : null}
              </div>

              <label className="fy-goal-check">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                <span>
                  {t("Page_Contact_ConsentPrefix")}{" "}
                  <a className="fy-inline-link" href="/privacy">
                    {t("Common_PrivacyPolicy")}
                  </a>{" "}
                  {t("Common_And")}{" "}
                  <a className="fy-inline-link" href="/terms">
                    {t("Common_Terms")}
                  </a>
                  .
                </span>
              </label>
              {!consent && formStarted ? (
                <span className="validation-message">{t("Page_Contact_Val_ConsentRequired")}</span>
              ) : null}

              {!mailDeliveryUnavailable ? (
                <div className="fy-field fy-captcha-field">
                  <label htmlFor="contact-captcha">
                    {t("Page_Contact_LabelSecurityCheck")}{" "}
                    {captchaChallenge ? <span>{t("Page_Contact_SecurityCheckPrompt", captchaChallenge)}</span> : null}
                  </label>
                  {captchaApiOffline ? (
                    <div className="fy-contact-unavailable" role="status">
                      <strong>{t("Page_Contact_Unavailable_Title")}</strong>
                      <p className="fy-audience">
                        {t("Page_Contact_Unavailable_Body_Before")}
                        <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
                          {CONTACT_EMAIL}
                        </a>
                        {t("Page_Contact_Unavailable_Body_After")}
                      </p>
                      <button type="button" className="fy-btn fy-btn-secondary fy-captcha-retry" onClick={() => void loadCaptcha()}>
                        {t("Page_Contact_BtnTryAgain")}
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        id="contact-captcha"
                        className="fy-input fy-captcha-input"
                        inputMode="numeric"
                        autoComplete="off"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                      />
                      {captchaError ? <span className="validation-message">{captchaError}</span> : null}
                    </>
                  )}
                </div>
              ) : null}

              {mailDeliveryUnavailable ? (
                <div className="fy-contact-unavailable" role="alert">
                  <strong>{t("Page_Contact_DeliveryUnavailable_Title")}</strong>
                  <p className="fy-audience">
                    {t("Page_Contact_Unavailable_Body_Before")}
                    <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    {t("Page_Contact_Unavailable_Body_After")}
                  </p>
                  <a className="fy-btn fy-btn-primary fy-contact-email-cta" href={`mailto:${CONTACT_EMAIL}`}>
                    {t("Page_Contact_BtnEmailUs")}
                  </a>
                </div>
              ) : submitError ? (
                <p className="fy-contact-error" role="alert">
                  {submitError}
                </p>
              ) : null}

              {!canSubmit && formStarted && submitBlockers.length > 0 ? (
                <p className="validation-message" role="status">
                  {submitBlockers[0]}
                </p>
              ) : null}

              <button type="submit" className="fy-btn fy-btn-primary fy-btn-calc" disabled={!canSubmit}>
                {submitting ? t("Page_Contact_BtnSending") : t("Page_Contact_BtnSend")}
              </button>
            </form>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
