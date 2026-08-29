import { CONTACT_PHONE } from "../../../lib/config";

export function WhatsAppFab() {
  const href = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I saw your site and would like to talk.",
  )}`;

  return (
    <a
      className="gs-wa-fab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GrowwStack on WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.02 3C9.4 3 4.05 8.35 4.05 14.98c0 2.34.62 4.53 1.7 6.43L4 29l7.79-1.72a11.9 11.9 0 0 0 4.23.77h.01c6.62 0 11.97-5.35 11.97-11.97C28 8.36 22.64 3 16.02 3zm0 21.85c-1.37 0-2.7-.34-3.88-.99l-.28-.16-4.62 1.02.99-4.5-.18-.29a9.9 9.9 0 0 1-1.5-5.25c0-5.5 4.46-9.97 9.97-9.97 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.93 7.05c0 5.5-4.48 9.97-9.97 9.97zm5.47-7.47c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.71.64.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.07-.13-.28-.2-.58-.35z"
        />
      </svg>
      <span className="gs-wa-fab__label">Chat</span>
    </a>
  );
}
