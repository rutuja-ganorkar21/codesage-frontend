import { useNavigate } from "react-router";
import { Plus, Edit, Trash2, Video } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <Plus size={22} />,
      title: "Create Problem",
      description:
        "Add a new coding problem to the platform with test cases, solutions and editorial.",
      btnLabel: "Create Problem",
      accent: "#6366f1",
      glow: "#6366f133",
      route: "/admin/create",
    },
    {
      icon: <Edit size={22} />,
      title: "Update Problem",
      description:
        "Edit existing problems, modify test cases, update solutions and descriptions.",
      btnLabel: "Update Problem",
      accent: "#f59e0b",
      glow: "#f59e0b33",
      route: "/admin/update",
    },
    {
      icon: <Trash2 size={22} />,
      title: "Delete Problem",
      description:
        "Permanently remove problems from the platform. This action cannot be undone.",
      btnLabel: "Delete Problem",
      accent: "#f87171",
      glow: "#f8717133",
      route: "/admin/delete",
    },
    {
      icon: <Video size={22} />,
      title: "Vedio Problem",
      description:
        "Upload video solutions for coding problems to help users understand approaches better.",
      btnLabel: "Upload Video",
      accent: "#34d399",
      glow: "#34d39933",
      route: "/admin/video",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: "52px",
          borderBottom: "1px solid #1e293b",
          background: "#0d1117",
        }}
      >
        {/* CodeSage Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path
              d="M20 2L37 20L20 38L3 20Z"
              fill="url(#plg)"
              opacity="0.18"
              stroke="#6366f1"
              strokeWidth="1.2"
            />
            <path
              d="M20 8L33 20L20 32L7 20Z"
              fill="#0c1425"
              stroke="#6366f1"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M17 14L11 20L17 26"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 14L29 20L23 26"
              stroke="#818cf8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <line
              x1="23"
              y1="13"
              x2="17"
              y2="27"
              stroke="url(#plg)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.04em",
            }}
          >
            Code
            <span
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sage
            </span>
          </span>
        </div>

        {/* Back Button — same as before */}
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "6px 18px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, #6366f114 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "56px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#1e1b4b",
              border: "1px solid #6366f133",
              borderRadius: "999px",
              padding: "4px 16px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#a5b4fc",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Admin Dashboard
          </div>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              marginBottom: "10px",
              lineHeight: 1.1,
            }}
          >
            Manage Your Platform
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              maxWidth: "380px",
              lineHeight: "1.7",
              margin: "0 auto",
            }}
          >
            Create, update, or remove coding problems. Keep your platform fresh
            and up to date.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "28px",
            width: "100%",
            maxWidth: "960px",
            position: "relative",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.route}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                padding: "48px 36px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                transition:
                  "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = card.accent + "55";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${card.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e293b";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: card.glow,
                  border: `1px solid ${card.accent}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: card.accent,
                  marginBottom: "4px",
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                {card.title}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: "1.75",
                  flex: 1,
                }}
              >
                {card.description}
              </div>

              {/* Divider */}
              <div
                style={{ borderTop: "1px solid #1e293b", margin: "4px 0" }}
              />

              {/* Button */}
              <button
                onClick={() => navigate(card.route)}
                style={{
                  padding: "10px 0",
                  borderRadius: "9px",
                  border: `1px solid ${card.accent}44`,
                  background: card.glow,
                  color: card.accent,
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition:
                    "background 0.15s, border-color 0.15s, color 0.15s",
                  letterSpacing: "0.02em",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = card.accent;
                  e.target.style.color = "#fff";
                  e.target.style.borderColor = card.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = card.glow;
                  e.target.style.color = card.accent;
                  e.target.style.borderColor = card.accent + "44";
                }}
              >
                {card.btnLabel} →
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
