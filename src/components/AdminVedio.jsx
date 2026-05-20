import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Video, Trash2, Upload, ArrowLeft } from "lucide-react";
import axiosClient from "../utils/axiosClient";

function DifficultyBadge({ difficulty }) {
  const map = {
    easy: { bg: "#0a3a2e", color: "#34d399", border: "#34d39933" },
    medium: { bg: "#3a2a00", color: "#fbbf24", border: "#fbbf2433" },
    hard: { bg: "#3a0a0a", color: "#f87171", border: "#f8717133" },
  };
  const d = map[(difficulty || "easy").toLowerCase()] || map.easy;
  return (
    <span
      style={{
        background: d.bg,
        color: d.color,
        border: `1px solid ${d.border}`,
        padding: "4px 14px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {difficulty}
    </span>
  );
}

export default function AdminVedio() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState({ id: null, message: "" });

  useEffect(() => {
    axiosClient
      .get("/problem/getAllProblem")
      .then(({ data }) => setProblems(Array.isArray(data) ? data : []))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setDeleteError({ id: null, message: "" });
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert("Video deleted successfully!");
    } catch (err) {
      setDeleteError({
        id,
        message: err?.response?.data?.error || "Failed to delete video",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Navbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "56px",
          borderBottom: "1px solid #1e293b",
          background: "#0d1117",
        }}
      >
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
              <linearGradient id="cslg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path
              d="M20 2L37 20L20 38L3 20Z"
              fill="url(#cslg)"
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
              stroke="url(#cslg)"
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
        <button
          onClick={() => navigate("/admin")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* ── Body ── */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px" }}
      >
        {/* ── Heading ── */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0f172a",
              border: "1px solid #34d39933",
              borderRadius: "999px",
              padding: "5px 16px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#34d399",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            <Video size={12} /> Video Management
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
              lineHeight: 1.1,
            }}
          >
            Video Upload & Delete
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
            Upload or remove solution videos for coding problems.
          </p>
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 150px 220px 260px",
              padding: "16px 32px",
              borderBottom: "1px solid #1e293b",
              background: "#0a0f1e",
            }}
          >
            {["#", "Title", "Difficulty", "Tags", "Actions"].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div
              style={{
                padding: "64px",
                textAlign: "center",
                color: "#6366f1",
                fontSize: "14px",
              }}
            >
              Loading problems…
            </div>
          ) : problems.length === 0 ? (
            <div
              style={{
                padding: "64px",
                textAlign: "center",
                color: "#475569",
                fontSize: "14px",
              }}
            >
              No problems found.
            </div>
          ) : (
            problems.map((p, i) => (
              <div
                key={p._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 150px 220px 260px",
                  alignItems: "start",
                  padding: "20px 32px",
                  borderBottom:
                    i < problems.length - 1 ? "1px solid #1e293b" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#0d1117")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* # */}
                <div
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: 700,
                    paddingTop: "6px",
                  }}
                >
                  {i + 1}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#f1f5f9",
                    paddingTop: "6px",
                  }}
                >
                  {p.title}
                </div>

                {/* Difficulty */}
                <div style={{ paddingTop: "4px" }}>
                  <DifficultyBadge difficulty={p.difficulty} />
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    paddingTop: "4px",
                  }}
                >
                  {(p.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#1e293b",
                        color: "#94a3b8",
                        border: "1px solid #334155",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      onClick={() => navigate(`/admin/video/upload/${p._id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 20px",
                        borderRadius: "8px",
                        border: "1px solid #6366f133",
                        background: "#1e1b4b",
                        color: "#a5b4fc",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#6366f1";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "#6366f1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#1e1b4b";
                        e.currentTarget.style.color = "#a5b4fc";
                        e.currentTarget.style.borderColor = "#6366f133";
                      }}
                    >
                      <Upload size={13} /> Upload
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 20px",
                        borderRadius: "8px",
                        border: "1px solid #f8717133",
                        background: "#3a0a0a",
                        color: "#f87171",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f87171";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "#f87171";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#3a0a0a";
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.borderColor = "#f8717133";
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  {/* ── Inline error ── */}
                  {deleteError.id === p._id && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#3a0a0a",
                        border: "1px solid #f8717155",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#f87171",
                          fontWeight: 500,
                        }}
                      >
                        {deleteError.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
