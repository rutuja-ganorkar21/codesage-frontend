import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import ProfilePicture from "../components/ProfilePicture";

function CodeSageLogo({ isMobile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path
          d="M20 2L37 20L20 38L3 20Z"
          fill="url(#ng)"
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
          stroke="url(#ng)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {!isMobile && (
        <div
          style={{
            fontSize: "18px",
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
        </div>
      )}
    </div>
  );
}

function DiffBadge({ d }) {
  const map = {
    easy: { bg: "#0a3a2e", color: "#34d399", border: "#34d39933" },
    medium: { bg: "#3a2a00", color: "#fbbf24", border: "#fbbf2433" },
    hard: { bg: "#3a0a0a", color: "#f87171", border: "#f8717133" },
  };
  const s = map[(d || "easy").toLowerCase()] || map.easy;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {d}
    </span>
  );
}

function TagBadge({ tag }) {
  const s = { bg: "#0d1828", color: "#4a7099", border: "#1e3a5f" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "2px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {tag}
    </span>
  );
}

export default function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const dropdownRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolved] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/problem/getAllProblem")
      .then(({ data }) => setProblems(data))
      .catch(() => {});
    if (user)
      axiosClient
        .get("/problem/problemSolvedByUser")
        .then(({ data }) => setSolved(data))
        .catch(() => {});
  }, [user]);

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolved([]);
    setDropdown(false);
  };

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (Array.isArray(p.tags) &&
        p.tags.some((t) => t.toLowerCase().includes(q)));
    const matchDiff =
      filters.difficulty === "all" || p.difficulty === filters.difficulty;
    const matchTag =
      filters.tag === "all" ||
      (Array.isArray(p.tags) && p.tags.includes(filters.tag));
    const matchStatus =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === p._id));
    return matchSearch && matchDiff && matchTag && matchStatus;
  });

  const isSolved = (id) => solvedProblems.some((sp) => sp._id === id);

  const selectStyle = {
    height: "38px",
    padding: "0 12px",
    background: "#0b1220",
    border: "1px solid #131f33",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "13px",
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    cursor: "pointer",
    flex: 1,
    minWidth: isMobile ? "0" : "auto",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b12",
        color: "#e2e8f0",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 16px" : "0 32px",
          height: "56px",
          borderBottom: "1px solid #131f33",
          background: "#0b1220",
          position: "sticky",
          top: 0,
          zIndex: 50,
          gap: "12px",
        }}
      >
        <CodeSageLogo isMobile={isMobile} />

        {/* Search — desktop pe inline, mobile pe toggle */}
        {!isMobile ? (
          <div
            style={{
              flex: 1,
              maxWidth: "420px",
              margin: "0 32px",
              position: "relative",
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              style={{
                width: "100%",
                height: "36px",
                padding: "0 14px 0 36px",
                background: "#0d1828",
                border: "1px solid #6366f140",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "13px",
                outline: "none",
                fontFamily: "'DM Sans',sans-serif",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#6366f140")}
            />
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            {showSearch && (
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                autoFocus
                style={{
                  width: "100%",
                  height: "34px",
                  padding: "0 12px",
                  background: "#0d1828",
                  border: "1px solid #6366f140",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  outline: "none",
                  fontFamily: "'DM Sans',sans-serif",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>
        )}

        {/* Right side icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* Search icon — mobile only */}
          {isMobile && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                padding: "6px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          )}

          {/* User */}
          {user ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setDropdown(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "6px" : "10px",
                  padding: isMobile ? "4px 8px 4px 4px" : "5px 14px 5px 5px",
                  background: "#0b1220",
                  border: "1px solid #1e2d45",
                  borderRadius: "10px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#6366f1")
                }
                onMouseLeave={(e) => {
                  if (!dropdownOpen)
                    e.currentTarget.style.borderColor = "#1e2d45";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #6366f144",
                    flexShrink: 0,
                  }}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {user.firstName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name — desktop only */}
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#e2e8f0",
                        lineHeight: 1.2,
                      }}
                    >
                      {user.firstName}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#2d3f5c",
                        lineHeight: 1.2,
                      }}
                    >
                      View Profile
                    </span>
                  </div>
                )}

                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2d3f5c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "48px",
                    width: "200px",
                    background: "#0b1220",
                    border: "1px solid #131f33",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)",
                    }}
                  />
                  <div style={{ padding: "6px" }}>
                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 14px",
                          background: "none",
                          border: "none",
                          color: "#818cf8",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: "8px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#131f33")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        ⚙ Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 14px",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#131f33")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      👤 View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 14px",
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#131f33")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              style={{
                padding: isMobile ? "7px 14px" : "8px 18px",
                background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </nav>

      {/* ── Body ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "28px 32px",
        }}
      >
        {/* ── Filters ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={selectStyle}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
            style={selectStyle}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            style={selectStyle}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="string">String</option>
            <option value="linked list">Linked List</option>
            <option value="queue">Queue</option>
            <option value="stack">Stack</option>
            <option value="dynamic programming">Dynamic Programming</option>
            <option value="graph">Graph</option>
            <option value="tree">Tree</option>
            <option value="greedy">Greedy</option>
          </select>
        </div>

        {/* Count */}
        <div
          style={{ fontSize: "12px", color: "#475569", marginBottom: "14px" }}
        >
          Showing{" "}
          <span style={{ color: "#6366f1", fontWeight: 700 }}>
            {filtered.length}
          </span>{" "}
          of {problems.length} problems
        </div>

        {/* ── Problem List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((p, i) => (
            <NavLink
              key={p._id}
              to={`/problem/${p._id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "32px 1fr" : "48px 1fr auto",
                  alignItems: "center",
                  gap: isMobile ? "10px" : "16px",
                  background: "#0b1220",
                  border: "1px solid #131f33",
                  borderRadius: "12px",
                  padding: isMobile ? "14px 16px" : "18px 24px",
                  transition: "border-color 0.15s, background 0.15s",
                  cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366f155";
                  e.currentTarget.style.background = "#0d1628";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#131f33";
                  e.currentTarget.style.background = "#0b1220";
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1e2d45",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </div>

                {/* Title + Tags */}
                <div>
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      fontWeight: 600,
                      color: "#f1f5f9",
                      marginBottom: "8px",
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    <DiffBadge d={p.difficulty} />
                    {!isMobile &&
                      (Array.isArray(p.tags) ? p.tags : [p.tags])
                        .filter(Boolean)
                        .map((t, idx) => <TagBadge key={idx} tag={t} />)}
                  </div>
                </div>

                {/* Solved badge — desktop only */}
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      minWidth: "70px",
                    }}
                  >
                    {isSolved(p._id) ? (
                      <span
                        style={{
                          background: "#0a3a2e",
                          color: "#34d399",
                          border: "1px solid #34d39933",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        Solved
                      </span>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1e2d45"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                )}

                {/* Mobile — solved dot */}
                {isMobile && isSolved(p._id) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "16px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#34d399",
                    }}
                  />
                )}
              </div>
            </NavLink>
          ))}

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#2d3f5c",
                fontSize: "14px",
              }}
            >
              No problems found
            </div>
          )}
        </div>

        {showProfileModal && (
          <ProfilePicture onClose={() => setShowProfileModal(false)} />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #2d4a6b; }
        select option { background: #0b1220; }
      `}</style>
    </div>
  );
}
