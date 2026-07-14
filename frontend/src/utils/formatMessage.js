// The backend's SYSTEM_PROMPT instructs the model to return clean HTML
// (h2, h3, p, ul/li, strong, a, etc.), so assistant messages are rendered
// as-is. User-typed text is plain text, so it gets escaped first and line
// breaks are converted to <br/> for readability.

export function escapeUserText(text = "") {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
}

export function formatTime(timestamp) {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Turns a raw model id like "gemini-3.1-flash-lite" into a readable
// label like "Gemini 3.1 Flash Lite" for the model badge.
export function formatModelName(modelId = "") {
    if (!modelId) return "";

    return modelId
        .split("-")
        .map((part) => {
            if (/^\d/.test(part)) return part; // keep version numbers as-is
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ");
}
