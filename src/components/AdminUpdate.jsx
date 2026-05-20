import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Edit } from "lucide-react";
import axiosClient from "../utils/axiosClient";

export default function AdminUpdate() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/problem/getAllProblem")
      .then(({ data }) => setProblems(Array.isArray(data) ? data : []))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const difficultyColor = (d) => {
    const map = {
      easy: { color: "#34d399", bg: "#0a3a2e", border: "#34d39933" },
      medium: { color: "#fbbf24", bg: "#3a2a00", border: "#fbbf2433" },
      hard: { color: "#f87171", bg: "#3a0a0a", border: "#f8717133" },
    };
    return map[(d || "easy").toLowerCase()] || map.easy;
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
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "56px",
          borderBottom: "1px solid #1e293b",
          background: "#0d1117",
          position: "sticky",
          top: 0,
          zIndex: 10,
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
            padding: "7px 18px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e293b";
            e.currentTarget.style.color = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          ← Admin
        </button>
      </div>

      {/* Body */}
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 32px" }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "36px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#f59e0b22",
                border: "1px solid #f59e0b33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
              }}
            >
              <Edit size={18} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
              }}
            >
              Update Problem
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: "13px", marginLeft: "50px" }}>
            Select a problem to edit its details, test cases and solutions.
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 180px 250px 140px",
              padding: "13px 28px",
              borderBottom: "1px solid #1e293b",
              fontSize: "11px",
              fontWeight: 700,
              color: "#475569",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              background: "#0d1117",
            }}
          >
            <div>Title</div>
            <div>Difficulty</div>
            <div>Tags</div>
            <div style={{ textAlign: "right" }}>Action</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div
              style={{
                padding: "56px",
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
                padding: "56px",
                textAlign: "center",
                color: "#334155",
                fontSize: "14px",
              }}
            >
              No problems found.
            </div>
          ) : (
            problems.map((p, i) => {
              const dc = difficultyColor(p.difficulty);
              return (
                <div
                  key={p._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 180px 250px 140px",
                    padding: "15px 28px",
                    borderBottom:
                      i < problems.length - 1 ? "1px solid #1e293b" : "none",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0d1117")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Title */}
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#e2e8f0",
                    }}
                  >
                    {p.title}
                  </div>

                  {/* Difficulty */}
                  <div>
                    <span
                      style={{
                        background: dc.bg,
                        color: dc.color,
                        padding: "3px 12px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: `1px solid ${dc.border}`,
                        textTransform: "capitalize",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  {/* Tags */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {(Array.isArray(p.tags) ? p.tags : [])
                      .slice(0, 2)
                      .map((tag, j) => (
                        <span
                          key={j}
                          style={{
                            background: "#1e293b",
                            color: "#94a3b8",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 500,
                            border: "1px solid #334155",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Edit Button */}
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => navigate(`/admin/update/${p._id}`)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "8px",
                        border: "1px solid #f59e0b44",
                        background: "#f59e0b15",
                        color: "#f59e0b",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f59e0b";
                        e.currentTarget.style.color = "#000";
                        e.currentTarget.style.borderColor = "#f59e0b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f59e0b15";
                        e.currentTarget.style.color = "#f59e0b";
                        e.currentTarget.style.borderColor = "#f59e0b44";
                      }}
                    >
                      <Edit size={13} />
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Count */}
        {!loading && problems.length > 0 && (
          <div
            style={{ marginTop: "14px", fontSize: "12px", color: "#475569" }}
          >
            Showing {problems.length} problem{problems.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
