import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { sbInsert } from "../../../lib/supabase";
import { trackEvent } from "../../../lib/events";

const partnershipStages = [
  {
    number: "01",
    title: "Apply",
    description:
      "Share your business, current performance, and growth challenges.",
  },
  {
    number: "02",
    title: "Evaluate fit",
    description:
      "We assess product, demand, margins, fulfilment, and founder commitment.",
  },
  {
    number: "03",
    title: "Meet the founder",
    description:
      "Shortlisted businesses have a private 1:1 growth discussion.",
  },
  {
    number: "04",
    title: "Plan the stack",
    description:
      "Define the technology, acquisition, sales, CRM, and analytics required.",
  },
  {
    number: "05",
    title: "Build and operate",
    description:
      "Implement together, measure performance, improve, and scale.",
  },
];

const partnerCriteria = [
  "A validated product or service",
  "A strong customer value proposition",
  "Healthy commercial margins",
  "Reliable fulfilment or service capability",
  "An involved founder or senior decision-maker",
  "Willingness to share operational and sales information",
  "Capacity to support increased demand",
  "Long-term growth ambition",
];

const applicationSteps = [
  { number: "01", label: "Company" },
  { number: "02", label: "Business", optional: true },
  { number: "03", label: "Growth system", optional: true },
  { number: "04", label: "Opportunity", optional: true },
];

type ApplicationData = {
  founderName: string;
  companyName: string;
  website: string;
  linkedIn: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  yearsInBusiness: string;
  offer: string;
  differentiation: string;
  idealCustomer: string;
  monthlyRevenueRange: string;
  recentRevenue: string;
  averageOrderValue: string;
  grossMargin: string;
  bestSellers: string;
  platform: string;
  monthlyTraffic: string;
  monthlyLeads: string;
  conversionRate: string;
  salesTeamSize: string;
  crm: string;
  marketingChannels: string;
  fulfilment: string;
  scalingBlocker: string;
  sixMonthSuccess: string;
  supportAreas: string;
  partnershipReason: string;
  demandCapacity: string;
  dataSharing: string;
};

const initialApplication: ApplicationData = {
  founderName: "",
  companyName: "",
  website: "",
  linkedIn: "",
  email: "",
  phone: "",
  industry: "",
  location: "",
  yearsInBusiness: "",
  offer: "",
  differentiation: "",
  idealCustomer: "",
  monthlyRevenueRange: "",
  recentRevenue: "",
  averageOrderValue: "",
  grossMargin: "",
  bestSellers: "",
  platform: "",
  monthlyTraffic: "",
  monthlyLeads: "",
  conversionRate: "",
  salesTeamSize: "",
  crm: "",
  marketingChannels: "",
  fulfilment: "",
  scalingBlocker: "",
  sixMonthSuccess: "",
  supportAreas: "",
  partnershipReason: "",
  demandCapacity: "",
  dataSharing: "",
};

export function PartnershipProcessSection() {
  return (
    <section
      id="process"
      className="gs-section gs-partnership-process gs-partnership-process--compact"
      aria-labelledby="partnership-process-title"
    >
      <div className="gs-shell">
        <header className="gs-section__header gs-partnership-process__header">
          <p className="gs-eyebrow">How partnership begins</p>
          <h2 id="partnership-process-title" className="gs-section__title">
            From first conversation to growth.
          </h2>
        </header>

        <ol className="gs-process" aria-label="GrowwStack partnership process">
          {partnershipStages.map((stage, index) => (
            <li
              key={stage.number}
              value={index + 1}
              className="gs-process__item"
            >
              <span className="gs-process__number" aria-hidden="true">
                {stage.number}
              </span>
              <div className="gs-process__content">
                <h3 className="gs-process__title">{stage.title}</h3>
                <p className="gs-process__description">{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="gs-process__note" aria-label="Partnership availability">
          <p className="gs-process__note-label">Limited by design</p>
          <p>
            GrowwStack accepts only a limited number of partnerships to ensure
            direct founder involvement and accountable execution.
          </p>
        </aside>
        <PartnerFitSection />
      </div>
    </section>
  );
}

export function PartnerFitSection() {
  return (
    <details
      id="partner-fit"
      className="gs-disclosure gs-partner-fit-disclosure"
    >
      <summary>Is your business ready for a partnership?</summary>
      <div className="gs-disclosure__body">
        <ul className="gs-fit-grid" aria-label="Ideal partner criteria">
          {partnerCriteria.map((criterion) => (
            <li key={criterion} className="gs-fit-grid__item">
              <span className="gs-fit-grid__marker" aria-hidden="true">
                ✓
              </span>
              <span className="gs-fit-grid__text">{criterion}</span>
            </li>
          ))}
        </ul>

        <a className="gs-button gs-button--primary" href="#apply">Start your application</a>
      </div>
    </details>
  );
}

export function ApplicationSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] =
    useState<ApplicationData>(initialApplication);
  const [uploads, setUploads] = useState<File[]>([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitIntentRef = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const activeStep = applicationSteps[currentStep];
  const isFinalStep = currentStep === applicationSteps.length - 1;

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setApplication((current) => ({ ...current, [name]: value }));
  };

  const handleUploads = (event: ChangeEvent<HTMLInputElement>) => {
    setUploads(Array.from(event.currentTarget.files ?? []));
  };

  const focusStepHeading = () => {
    window.setTimeout(() => stepHeadingRef.current?.focus(), 0);
  };

  const continueApplication = () => {
    if (!formRef.current?.reportValidity()) return;
    setCurrentStep((step) => Math.min(step + 1, applicationSteps.length - 1));
    focusStepHeading();
  };

  const returnToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    focusStepHeading();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Enter inside a field advances the step; only an explicit submit press sends.
    if (!isFinalStep && !submitIntentRef.current) {
      continueApplication();
      return;
    }
    submitIntentRef.current = false;

    if (!formRef.current?.reportValidity()) return;

    setStatus("sending");
    setErrorMsg(null);

    try {
      await sbInsert("gs_applications", {
        founder_name: application.founderName.trim(),
        company_name: application.companyName.trim() || null,
        email: application.email.trim() || null,
        phone: application.phone.trim() || null,
        website: application.website.trim() || null,
        linkedin: application.linkedIn.trim() || null,
        industry: application.industry || null,
        location: application.location.trim() || null,
        years_in_business: application.yearsInBusiness || null,
        offer: application.offer.trim() || null,
        differentiation: application.differentiation.trim() || null,
        ideal_customer: application.idealCustomer.trim() || null,
        monthly_revenue_range: application.monthlyRevenueRange || null,
        recent_revenue: application.recentRevenue.trim() || null,
        average_order_value: application.averageOrderValue.trim() || null,
        gross_margin: application.grossMargin.trim() || null,
        best_sellers: application.bestSellers.trim() || null,
        platform: application.platform.trim() || null,
        crm: application.crm.trim() || null,
        monthly_traffic: application.monthlyTraffic.trim() || null,
        monthly_leads: application.monthlyLeads.trim() || null,
        conversion_rate: application.conversionRate.trim() || null,
        sales_team_size: application.salesTeamSize.trim() || null,
        marketing_channels: application.marketingChannels.trim() || null,
        fulfilment: application.fulfilment.trim() || null,
        scaling_blocker: application.scalingBlocker.trim() || null,
        six_month_success: application.sixMonthSuccess.trim() || null,
        support_areas: application.supportAreas.trim() || null,
        partnership_reason: application.partnershipReason.trim() || null,
        demand_capacity: application.demandCapacity || null,
        data_sharing: application.dataSharing || null,
        file_names: uploads.length ? uploads.map((f) => f.name).join(", ") : null,
        source: "partnership_application",
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
      setStatus("sent");
      trackEvent("form_submit", "partnership_application");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section
      id="apply"
      className="gs-section gs-application gs-application--compact"
      aria-labelledby="application-title"
    >
      <div className="gs-shell">
        <div className="gs-application__layout">
          <header className="gs-section__header gs-application__header">
            <p className="gs-eyebrow">Partnership application</p>
            <h2 id="application-title" className="gs-section__title">
              Apply to grow together.
            </h2>
            <p className="gs-section__lede">
              Start with your company and contact details. Add more context if you have it.
            </p>

            <p className="gs-review-flow__note">Applications are reviewed before a meeting is offered.</p>
          </header>

          <details className="gs-disclosure gs-application__disclosure" data-hash-disclosure>
            <summary>Open partnership application <span>Company details first · Further detail optional</span></summary>
            <div className="gs-disclosure__body">
            <div className="gs-review-flow" aria-label="Application review flow">
              <p className="gs-review-flow__label">What happens next</p>
              <p className="gs-review-flow__sequence">Reviewed by GrowwStack. Shortlisted businesses receive a private meeting invitation.</p>
              <p className="gs-review-flow__note">
                Submitting an application does not guarantee acceptance or a
                meeting invitation.
              </p>
            </div>
            </div>
          <div className="gs-application__form-panel gs-disclosure__body">
            <div className="gs-application-progress">
              <div className="gs-application-progress__summary">
                <span>
                  Step {currentStep + 1} of {applicationSteps.length}
                </span>
                <span>{activeStep.label}</span>
              </div>
              <progress
                className="gs-application-progress__bar"
                value={currentStep + 1}
                max={applicationSteps.length}
                aria-label={`Application progress: step ${currentStep + 1} of ${applicationSteps.length}`}
              />
              <ol className="gs-application-progress__steps" aria-label="Application steps">
                {applicationSteps.map((step, index) => (
                  <li
                    key={step.number}
                    className={`gs-application-progress__step${
                      index === currentStep
                        ? " gs-application-progress__step--current"
                        : ""
                    }${
                      index < currentStep
                        ? " gs-application-progress__step--complete"
                        : ""
                    }`}
                    aria-current={index === currentStep ? "step" : undefined}
                  >
                    <span aria-hidden="true">{step.number}</span>
                    <span>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="gs-visually-hidden" aria-live="polite">
              Step {currentStep + 1}: {activeStep.label}
            </p>

            <form
              ref={formRef}
              className="gs-application-form"
              onSubmit={handleSubmit}
            >
              {currentStep === 0 && (
                <fieldset className="gs-form-step">
                  <legend className="gs-visually-hidden">Company information</legend>
                  <h3
                    ref={stepHeadingRef}
                    className="gs-form-step__title"
                    tabIndex={-1}
                  >
                    Company
                  </h3>
                  <p className="gs-form-step__intro">
                    Start with the people and business we would be partnering with.
                  </p>
                  <div className="gs-form-grid">
                    <FormField
                      id="application-founder-name"
                      label="Founder or decision-maker name"
                      name="founderName"
                      value={application.founderName}
                      onChange={handleFieldChange}
                      autoComplete="name"
                      required
                    />
                    <FormField
                      id="application-company-name"
                      label="Company name"
                      name="companyName"
                      value={application.companyName}
                      onChange={handleFieldChange}
                      autoComplete="organization"
                      required
                    />
                    <FormField
                      id="application-website"
                      label="Website"
                      name="website"
                      value={application.website}
                      onChange={handleFieldChange}
                      type="url"
                      placeholder="https://"
                      autoComplete="url"
                    />
                    <FormField
                      id="application-linkedin"
                      label="LinkedIn profile"
                      name="linkedIn"
                      value={application.linkedIn}
                      onChange={handleFieldChange}
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                    />
                    <FormField
                      id="application-email"
                      label="Work email"
                      name="email"
                      value={application.email}
                      onChange={handleFieldChange}
                      type="email"
                      autoComplete="email"
                      required
                    />
                    <FormField
                      id="application-phone"
                      label="Phone number"
                      name="phone"
                      value={application.phone}
                      onChange={handleFieldChange}
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                    <SelectField
                      id="application-industry"
                      label="Industry"
                      name="industry"
                      value={application.industry}
                      onChange={handleFieldChange}
                      options={[
                        "Consumer brand",
                        "Manufacturing",
                        "Healthcare",
                        "Professional services",
                        "Technology or SaaS",
                        "Other",
                      ]}
                    />
                    <FormField
                      id="application-location"
                      label="Primary location"
                      name="location"
                      value={application.location}
                      onChange={handleFieldChange}
                      autoComplete="address-level2"
                    />
                    <FormField
                      id="application-years"
                      label="Years in business"
                      name="yearsInBusiness"
                      value={application.yearsInBusiness}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      step="0.5"
                      inputMode="decimal"
                    />
                  </div>
                </fieldset>
              )}

              {currentStep === 1 && (
                <fieldset className="gs-form-step">
                  <legend className="gs-visually-hidden">Business information</legend>
                  <h3
                    ref={stepHeadingRef}
                    className="gs-form-step__title"
                    tabIndex={-1}
                  >
                    Business
                  </h3>
                  <p className="gs-form-step__intro">
                    Help us understand the value customers buy and the economics
                    behind it.
                  </p>
                  <div className="gs-form-grid">
                    <TextAreaField
                      id="application-offer"
                      label="What do you sell?"
                      name="offer"
                      value={application.offer}
                      onChange={handleFieldChange}
                      hint="Describe the core product or service in plain language."
                      required
                      wide
                    />
                    <TextAreaField
                      id="application-differentiation"
                      label="What makes it meaningfully different?"
                      name="differentiation"
                      value={application.differentiation}
                      onChange={handleFieldChange}
                      wide
                    />
                    <TextAreaField
                      id="application-ideal-customer"
                      label="Who is your ideal customer?"
                      name="idealCustomer"
                      value={application.idealCustomer}
                      onChange={handleFieldChange}
                      wide
                    />
                    <SelectField
                      id="application-revenue-range"
                      label="Current monthly revenue range"
                      name="monthlyRevenueRange"
                      value={application.monthlyRevenueRange}
                      onChange={handleFieldChange}
                      options={[
                        "Pre-revenue",
                        "Below ₹5 lakh",
                        "₹5–20 lakh",
                        "₹20–50 lakh",
                        "₹50 lakh–₹1 crore",
                        "Above ₹1 crore",
                      ]}
                    />
                    <FormField
                      id="application-recent-revenue"
                      label="Revenue for each of the previous 3 months"
                      name="recentRevenue"
                      value={application.recentRevenue}
                      onChange={handleFieldChange}
                      placeholder="Example: ₹12L, ₹15L, ₹18L"
                    />
                    <FormField
                      id="application-aov"
                      label="Average order or contract value"
                      name="averageOrderValue"
                      value={application.averageOrderValue}
                      onChange={handleFieldChange}
                      placeholder="Example: ₹4,500"
                    />
                    <FormField
                      id="application-margin"
                      label="Approximate gross margin"
                      name="grossMargin"
                      value={application.grossMargin}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      inputMode="decimal"
                      suffix="%"
                    />
                    <TextAreaField
                      id="application-bestsellers"
                      label="Best-selling products or services"
                      name="bestSellers"
                      value={application.bestSellers}
                      onChange={handleFieldChange}
                      wide
                    />
                  </div>
                </fieldset>
              )}

              {currentStep === 2 && (
                <fieldset className="gs-form-step">
                  <legend className="gs-visually-hidden">Current growth system</legend>
                  <h3
                    ref={stepHeadingRef}
                    className="gs-form-step__title"
                    tabIndex={-1}
                  >
                    Growth system
                  </h3>
                  <p className="gs-form-step__intro">
                    Show us what currently generates, captures, and fulfils demand.
                  </p>
                  <div className="gs-form-grid">
                    <SelectField
                      id="application-platform"
                      label="Primary website or commerce platform"
                      name="platform"
                      value={application.platform}
                      onChange={handleFieldChange}
                      options={[
                        "No website yet",
                        "Shopify",
                        "WooCommerce",
                        "Custom website",
                        "Marketplace-first",
                        "Other",
                      ]}
                    />
                    <FormField
                      id="application-traffic"
                      label="Approximate monthly website traffic"
                      name="monthlyTraffic"
                      value={application.monthlyTraffic}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      inputMode="numeric"
                    />
                    <FormField
                      id="application-leads"
                      label="Approximate monthly leads"
                      name="monthlyLeads"
                      value={application.monthlyLeads}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      inputMode="numeric"
                    />
                    <FormField
                      id="application-conversion"
                      label="Approximate conversion rate"
                      name="conversionRate"
                      value={application.conversionRate}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      inputMode="decimal"
                      suffix="%"
                    />
                    <FormField
                      id="application-sales-team"
                      label="Sales team size"
                      name="salesTeamSize"
                      value={application.salesTeamSize}
                      onChange={handleFieldChange}
                      type="number"
                      min="0"
                      inputMode="numeric"
                    />
                    <SelectField
                      id="application-crm"
                      label="Current CRM"
                      name="crm"
                      value={application.crm}
                      onChange={handleFieldChange}
                      options={[
                        "None",
                        "Spreadsheets",
                        "HubSpot",
                        "Zoho",
                        "Salesforce",
                        "Other",
                      ]}
                    />
                    <TextAreaField
                      id="application-marketing"
                      label="Active marketing channels"
                      name="marketingChannels"
                      value={application.marketingChannels}
                      onChange={handleFieldChange}
                      hint="Include paid, organic, marketplace, referral, outbound, or offline channels."
                      wide
                    />
                    <TextAreaField
                      id="application-fulfilment"
                      label="How do you fulfil orders or deliver the service?"
                      name="fulfilment"
                      value={application.fulfilment}
                      onChange={handleFieldChange}
                      wide
                    />
                  </div>
                </fieldset>
              )}

              {currentStep === 3 && (
                <fieldset className="gs-form-step">
                  <legend className="gs-visually-hidden">Growth opportunity</legend>
                  <h3
                    ref={stepHeadingRef}
                    className="gs-form-step__title"
                    tabIndex={-1}
                  >
                    Opportunity
                  </h3>
                  <p className="gs-form-step__intro">
                    Define the constraint, the outcome, and what a real partnership
                    would need to unlock.
                  </p>
                  <div className="gs-form-grid">
                    <TextAreaField
                      id="application-blocker"
                      label="What is the biggest blocker to scaling today?"
                      name="scalingBlocker"
                      value={application.scalingBlocker}
                      onChange={handleFieldChange}
                      required
                      wide
                    />
                    <TextAreaField
                      id="application-success"
                      label="What would success look like six months from now?"
                      name="sixMonthSuccess"
                      value={application.sixMonthSuccess}
                      onChange={handleFieldChange}
                      wide
                    />
                    <TextAreaField
                      id="application-support"
                      label="Where do you need the most support?"
                      name="supportAreas"
                      value={application.supportAreas}
                      onChange={handleFieldChange}
                      hint="For example: technology, acquisition, sales, CRM, analytics, or operations."
                      wide
                    />
                    <TextAreaField
                      id="application-why-partner"
                      label="Why do you want GrowwStack as an operating partner?"
                      name="partnershipReason"
                      value={application.partnershipReason}
                      onChange={handleFieldChange}
                      wide
                    />

                    <ChoiceGroup
                      legend="Can the business support 2–3x current demand?"
                      name="demandCapacity"
                      value={application.demandCapacity}
                      onChange={handleFieldChange}
                      options={[
                        "Yes, with current operations",
                        "Yes, with planned investment",
                        "Not yet",
                      ]}
                    />
                    <ChoiceGroup
                      legend="Are you comfortable sharing operating and sales data?"
                      name="dataSharing"
                      value={application.dataSharing}
                      onChange={handleFieldChange}
                      options={["Yes", "Yes, under NDA", "I need to discuss this"]}
                    />

                    <div className="gs-field gs-field--wide gs-upload-field">
                      <label className="gs-field__label" htmlFor="application-uploads">
                        Supporting documents <span>(optional)</span>
                      </label>
                      <p id="application-uploads-hint" className="gs-field__hint">
                        Product catalogue, company presentation, sales report,
                        analytics export, or other useful documents.
                      </p>
                      <input
                        id="application-uploads"
                        className="gs-field__input gs-upload-field__input"
                        type="file"
                        multiple
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv,image/*"
                        aria-describedby="application-uploads-hint application-email-notice"
                        onChange={handleUploads}
                      />
                      {uploads.length > 0 && (
                        <ul className="gs-upload-field__files" aria-label="Selected files">
                          {uploads.map((file) => (
                            <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div
                    id="application-email-notice"
                    className="gs-application-form__notice"
                    role="note"
                  >
                    <strong>Your application goes straight to the founder.</strong>
                    <span>
                      We read every one and reply within one working day. Any
                      documents you selected cannot be uploaded here for browser
                      security reasons &mdash; we will ask for them if we need them.
                    </span>                  </div>
                </fieldset>
              )}

              <div className="gs-application-form__actions">
                {currentStep > 0 && (
                  <button
                    className="gs-button gs-button--secondary"
                    type="button"
                    onClick={returnToPreviousStep}
                  >
                    Previous
                  </button>
                )}
                {!isFinalStep ? (
                  <>
                    <button
                      className="gs-button gs-button--primary"
                      type="submit"
                      onClick={() => {
                        submitIntentRef.current = true;
                      }}
                      disabled={status === "sending" || status === "sent"}
                    >
                      {status === "sending"
                        ? "Sending…"
                        : status === "sent"
                          ? "Application sent"
                          : "Submit application"}
                    </button>
                    <button
                      className="gs-button gs-button--secondary"
                      type="button"
                      onClick={continueApplication}
                    >
                      Add more detail
                    </button>
                  </>
                ) : (
                  <button
                    className="gs-button gs-button--primary"
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                  >
                    {status === "sending"
                      ? "Sending…"
                      : status === "sent"
                        ? "Application sent"
                        : "Submit application"}
                  </button>
                )}
              </div>

              {status === "sent" && (
                <p className="gs-application-form__status" role="status">
                  Application received. We read every one and will reply from the
                  founder&rsquo;s desk within one working day.
                </p>
              )}
              {status === "error" && (
                <p className="gs-application-form__status" role="alert">
                  {errorMsg} You can also email{" "}
                  <a href="mailto:ceo-office@growwstack.in">ceo-office@growwstack.in</a>.
                </p>
              )}

            </form>
          </div>
          </details>
        </div>
      </div>
    </section>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  name: keyof ApplicationData;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  type?: "text" | "email" | "tel" | "url" | "number";
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
  step?: string;
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "email" | "url";
  suffix?: string;
  required?: boolean;
};

function FormField({
  id,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  min,
  max,
  step,
  inputMode,
  suffix,
  required = false,
}: FormFieldProps) {
  return (
    <div className="gs-field">
      <label className="gs-field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="gs-field__control">
        <input
          id={id}
          className="gs-field__input"
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          required={required}
        />
        {suffix && <span className="gs-field__suffix">{suffix}</span>}
      </div>
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  name: keyof ApplicationData;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  hint?: string;
  required?: boolean;
  wide?: boolean;
};

function TextAreaField({
  id,
  label,
  name,
  value,
  onChange,
  hint,
  required = false,
  wide = false,
}: TextAreaFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={`gs-field${wide ? " gs-field--wide" : ""}`}>
      <label className="gs-field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={hintId} className="gs-field__hint">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        className="gs-field__textarea"
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        aria-describedby={hintId}
        required={required}
      />
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  name: keyof ApplicationData;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  options: string[];
  required?: boolean;
};

function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="gs-field">
      <label className="gs-field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={id}
        className="gs-field__select"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

type ChoiceGroupProps = {
  legend: string;
  name: "demandCapacity" | "dataSharing";
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  options: string[];
};

function ChoiceGroup({ legend, name, value, onChange, options }: ChoiceGroupProps) {
  return (
    <fieldset className="gs-choice-group gs-field--wide">
      <legend className="gs-field__label">
        {legend}
        <span aria-hidden="true"> *</span>
      </legend>
      <div className="gs-choice-group__options">
        {options.map((option, index) => {
          const id = `${name}-${index}`;
          return (
            <label key={option} className="gs-choice" htmlFor={id}>
              <input
                id={id}
                className="gs-choice__input"
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
              />
              <span className="gs-choice__label">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function compactForEmail(value: string, maximumLength = 220) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > maximumLength
    ? `${compact.slice(0, maximumLength - 1)}…`
    : compact;
}
