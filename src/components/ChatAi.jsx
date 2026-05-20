import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send, Sparkles } from "lucide-react";
import axiosClient from "../utils/axiosClient";

// ── Inline code badge renderer ──────────────────────────────────────────────
function renderContent(text) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={i}
        style={{
          background: "#0d2a1a",
          color: "#34d399",
          padding: "2px 7px",
          borderRadius: "5px",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          border: "1px solid #064e3b",
        }}
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    )
  );
}

// ── Typing indicator ────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#6366f1",
            animation: "bounce 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 7px rgba(99,102,241,0);    }
          100% { box-shadow: 0 0 0 0   rgba(99,102,241,0);    }
        }
      `}</style>
    </div>
  );
}

// ── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, isLatest }) {
  const isAI = msg.role === "model";
  const text = msg.parts[0].text;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        flexDirection: isAI ? "row" : "row-reverse",
        animation: isLatest ? "fadeSlideIn 0.25s ease" : "none",
      }}
    >
      {isAI && (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          AI
        </div>
      )}

      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: isAI ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          fontSize: "13.5px",
          lineHeight: 1.65,
          background: isAI ? "#0f172a" : "#3730a3",
          color: isAI ? "#cbd5e1" : "#eef2ff",
          border: isAI ? "1px solid #1e293b" : "1px solid #4338ca",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {isAI ? renderContent(text) : text}
      </div>
    </div>
  );
}

// ── Main ChatAi Component ────────────────────────────────────────────────────
const ChatAi = ({ problem }) => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: `Hi! I'm your DSA tutor for "${problem?.title || "this problem"}". Ask me for hints, code review, or approach suggestions!`,
        },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const messagesEndRef = useRef(null);
  const inputValue = watch("message", "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onSubmit = async (data) => {
    const text = data.message?.trim();
    if (!text) return;

    // User message — Gemini format mein
    const userMessage = { role: "user", parts: [{ text }] };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    reset();
    setIsTyping(true);

    try {
      const res = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,       // poori chat history
        title: problem?.title || "",
        description: problem?.description || "",
        testCases: problem?.visibleTestCases || [],
        startCode: problem?.startCode || "",
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: res.data.reply }] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Something went wrong. Please try again." }],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d1117",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "16px 20px",
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-ring 2.5s infinite",
            flexShrink: 0,
          }}
        >
          <Sparkles size={17} color="#fff" strokeWidth={2} />
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "0.02em",
          }}
        >
          CHAT with AI
        </div>
      </div>

      {/* ── Messages area ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          scrollbarWidth: "thin",
          scrollbarColor: "#1e293b transparent",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} isLatest={i === messages.length - 1} />
        ))}

        {isTyping && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              animation: "fadeSlideIn 0.2s ease",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              AI
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "4px 14px 14px 14px",
                background: "#0f172a",
                border: "1px solid #1e293b",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: "12px 14px",
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <input
          {...register("message", { required: true, minLength: 1 })}
          placeholder="Ask me anything about this problem..."
          autoComplete="off"
          style={{
            flex: 1,
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: "9px",
            padding: "10px 14px",
            color: "#e2e8f0",
            fontSize: "13.5px",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
        />

        <button
          type="submit"
          disabled={!inputValue?.trim() || isTyping}
          style={{
            width: 38,
            height: 38,
            background: inputValue?.trim() && !isTyping ? "#4f46e5" : "#1e293b",
            border: "none",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: inputValue?.trim() && !isTyping ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => {
            if (inputValue?.trim() && !isTyping)
              e.currentTarget.style.background = "#4338ca";
          }}
          onMouseLeave={(e) => {
            if (inputValue?.trim() && !isTyping)
              e.currentTarget.style.background = "#4f46e5";
          }}
          onMouseDown={(e) => {
            if (inputValue?.trim() && !isTyping)
              e.currentTarget.style.transform = "scale(0.93)";
          }}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Send size={15} color={inputValue?.trim() && !isTyping ? "#fff" : "#475569"} />
        </button>
      </form>
    </div>
  );
};

export default ChatAi;