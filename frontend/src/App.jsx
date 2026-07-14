import { useEffect, useRef, useState } from "react";

import api from "./api";
import "./App.css";

import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import SuggestedQuestions from "./components/SuggestedQuestions";
import TypingIndicator from "./components/TypingIndicator";
import TechStackBar from "./components/TechStackBar";
import ArchitectureModal from "./components/ArchitectureModal";
import { ChevronDownIcon, SendIcon } from "./components/icons";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "<p>Hi 👋 I'm Shakthi AI Assistant. Ask me anything about Shakthi's skills, experience, projects, or background.</p>",
  timestamp: Date.now(),
};

function App() {
  // All chat history lives only in React state for this session —
  // nothing is written to localStorage, so it resets on refresh.
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const bottomRef = useRef();
  const windowRef = useRef();
  const textareaRef = useRef();

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Track scroll position to toggle the "scroll to bottom" button
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distanceFromBottom > 150);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (messageText = input, { silent = false } = {}) => {
    if (!messageText.trim()) return;

    if (!silent) {
      const userMessage = {
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }

    try {
      setLoading(true);

      const response = await api.post("/api/chat", {
        message: messageText,
      });

      const { answer, error, model } = response.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          timestamp: Date.now(),
          // The backend returns a 200 with an "error" field for
          // handled failures (quota, retriever, etc.) — surface that
          // here so ChatMessage can style it differently.
          error: error || null,
          retryText: error ? messageText : null,
          model: model || null,
        },
      ]);
    } catch (err) {
      console.error(err);

      // Network failure / non-200 response that axios actually rejected.
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "<p>I couldn't reach the server. Please check your connection and try again.</p>",
          timestamp: Date.now(),
          error: "connection_error",
          retryText: messageText,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (messageText) => {
    if (!messageText) return;
    // Resend the original question without re-adding a duplicate
    // user bubble — the user already saw it once.
    sendMessage(messageText, { silent: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-resize the textarea as the user types
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const handleClear = () => {
    const confirmed = window.confirm(
      "Clear this conversation? This can't be undone."
    );
    if (!confirmed) return;

    // Only resets in-memory state — nothing is persisted, so there's
    // nothing else to clean up.
    setMessages([{ ...WELCOME_MESSAGE, timestamp: Date.now() }]);
  };

  return (
    <div className="app-shell">
      <div className="container">
        <Header onClear={handleClear} onShowArchitecture={() => setShowArchitecture(true)} />

        <div className="chat-window" ref={windowRef}>
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              error={msg.error}
              retryText={msg.retryText}
              model={msg.model}
              onRetry={handleRetry}
            />
          ))}

          {loading && <TypingIndicator />}

          <div ref={bottomRef}></div>

          {showScrollBtn && (
            <button className="scroll-bottom-btn" onClick={scrollToBottom} title="Scroll to latest">
              <ChevronDownIcon />
            </button>
          )}
        </div>

        {messages.length === 1 && (
          <SuggestedQuestions onSelect={sendMessage} />
        )}

        <TechStackBar />

        <div className="input-area">
          <textarea
            ref={textareaRef}
            rows="1"
            value={input}
            placeholder="Ask about Shakthi..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            title="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {showArchitecture && <ArchitectureModal onClose={() => setShowArchitecture(false)} />}
    </div>
  );
}

export default App;
