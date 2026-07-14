import { BotIcon, UserIcon, WarningIcon, RetryIcon, SparklesIcon } from "./icons";
import { escapeUserText, formatTime, formatModelName } from "../utils/formatMessage";

// Maps backend "error" codes to a short label + style variant.
// Anything not listed here falls back to a generic "error" style.
const ERROR_META = {
    rate_limited: { label: "Usage limit reached", variant: "warning", retryable: true },
    connection_error: { label: "Connection issue", variant: "error", retryable: true },
    retriever_unavailable: { label: "Knowledge base unavailable", variant: "error", retryable: true },
    internal_error: { label: "Something went wrong", variant: "error", retryable: false },
};

function ChatMessage({ role, content, timestamp, error, retryText, model, onRetry }) {
    const isUser = role === "user";
    const isError = Boolean(error);

    const meta = isError
        ? ERROR_META[error] || { label: "Something went wrong", variant: "error", retryable: false }
        : null;

    // Assistant replies arrive as ready-to-render HTML from the backend
    // (per its SYSTEM_PROMPT, e.g. <h2>, <p>, <ul><li>...). User messages
    // are plain text, so they're escaped before being rendered.
    const html = isUser ? escapeUserText(content) : content;

    const bubbleClass = [
        "message-bubble",
        isUser ? "user" : "assistant",
        isError ? `error error-${meta.variant}` : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={`message-row ${isUser ? "user" : "assistant"}`}>
            <div className={`avatar ${isUser ? "user" : "assistant"} ${isError ? `error-${meta.variant}` : ""}`}>
                {isUser ? <UserIcon /> : isError ? <WarningIcon /> : <BotIcon />}
            </div>

            <div className="message-content">
                {isError && <span className={`error-tag error-${meta.variant}`}>{meta.label}</span>}

                <div className={bubbleClass} dangerouslySetInnerHTML={{ __html: html }} />

                <div className="message-meta">
                    {timestamp && <span className="message-time">{formatTime(timestamp)}</span>}

                    {!isUser && !isError && model && (
                        <span className="model-badge" title="Model that generated this response">
                            <SparklesIcon size={11} />
                            {formatModelName(model)}
                        </span>
                    )}

                    {isError && meta.retryable && onRetry && (
                        <button className="retry-btn" onClick={() => onRetry(retryText)}>
                            <RetryIcon />
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
