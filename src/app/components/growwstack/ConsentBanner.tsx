import { useEffect, useState } from "react";
import { GA_ID } from "../../../lib/config";
import { readConsent, setConsent, type ConsentChoice } from "../../../lib/analytics";
import { isOptedOut, syncOptOutFromUrl } from "../../../lib/optOut";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Nothing to consent to when analytics isn't configured or this browser opted out.
    // Child effects run before App's, so read ?gs_track here too.
    syncOptOutFromUrl();
    if (!GA_ID || isOptedOut()) return;
    if (readConsent() === null) setOpen(true);
  }, []);

  useEffect(() => {
    // Lets the WhatsApp FAB move clear of the bar while it's showing.
    if (open) document.body.setAttribute("data-consent-open", "true");
    else document.body.removeAttribute("data-consent-open");
    return () => document.body.removeAttribute("data-consent-open");
  }, [open]);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <div className="gs-consent" role="dialog" aria-modal="false" aria-labelledby="gs-consent-title">
      <div className="gs-consent__inner">
        <div className="gs-consent__copy">
          <p className="gs-consent__title" id="gs-consent-title">
            Analytics cookies
          </p>
          <p>
            We use Google Analytics to measure visits, enquiries and campaign performance. Analytics
            cookies are stored only when you accept. We do not use Analytics for personalised advertising.
          </p>
        </div>
        <div className="gs-consent__actions">
          <button type="button" className="gs-consent__button" onClick={() => choose("denied")}>
            Decline
          </button>
          <button
            type="button"
            className="gs-consent__button gs-consent__button--primary"
            onClick={() => choose("granted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
