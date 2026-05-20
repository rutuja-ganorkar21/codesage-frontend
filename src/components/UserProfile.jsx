

import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { updateProfilePicture } from "../authSlice";
import ProgressPanel from "./ProgressPanel";
import ProfilePicture from "./ProfilePicture";

// ── Rank — percentage based ──────────────────────────────────
function getRank(solved, total) {
  if (!total) return { label: "🌱 Beginner", color: "#34d399" };
  const pct = (solved / total) * 100;
  if (pct >= 76) return { label: "🏆 Expert",   color: "#fbbf24" };
  if (pct >= 51) return { label: "💪 Warrior",  color: "#f87171" };
  if (pct >= 26) return { label: "🔥 Solver",   color: "#fb923c" };
  if (pct >= 11) return { label: "⚡ Explorer", color: "#818cf8" };
  return              { label: "🌱 Beginner",   color: "#34d399" };
}

// ── Motivation ───────────────────────────────────────────────
function getMotivation(solved, total, accuracy) {
  if (solved === 0) return "Start your journey — solve your first problem!";
  if (accuracy >= 90) return "Outstanding accuracy! You're solving smart, not just hard.";
  if (accuracy >= 75) return "Great accuracy! Keep the consistency going.";
  const pct = total ? (solved / total) * 100 : 0;
  if (pct >= 75) return "Almost there! You're in the top tier of solvers.";
  if (pct >= 50) return "Halfway through! Every problem makes you sharper.";
  if (pct >= 25) return "Good momentum! Keep solving consistently.";
  return "Great start! The journey of 1000 problems begins here.";
}

// ── Status map ───────────────────────────────────────────────
const STATUS_MAP = {
  accepted: { color: "#34d399", bg: "#0a3a2e", border: "#34d39933", label: "Accepted" },
  wrong:    { color: "#f87171", bg: "#3a0a0a", border: "#f8717133", label: "Wrong" },
  error:    { color: "#fbbf24", bg: "#3a2a00", border: "#fbbf2433", label: "Error" },
  pending:  { color: "#94a3b8", bg: "#1e2d45", border: "#94a3b833", label: "Pending" },
};
const getStatus  = (s) => STATUS_MAP[s] || STATUS_MAP.pending;
const getLang    = (l) => ({ javascript: "JS", java: "Java", cpp: "C++", "c++": "C++" }[l?.toLowerCase()] || l);
const diffColor  = (d) => ({ easy: "#34d399", medium: "#fbbf24", hard: "#f87171" }[d?.toLowerCase()] || "#94a3b8");

// ── Info row ─────────────────────────────────────────────────
function InfoRow({ label, value, valueColor, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: last ? "none" : "1px solid #0d1828" }}>
      <span style={{ fontSize: "12px", color: "#475569" }}>{label}</span>
      <span style={{ fontSize: "12px", color: valueColor || "#94a3b8", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function UserProfile() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const cameraRef = useRef(null);

  const [problems,       setProblems]      = useState([]);
  const [solvedProblems, setSolved]        = useState([]);
  const [submissions,    setSubmissions]   = useState([]);
  const [loadingSub,     setLoadingSub]    = useState(true);
  const [showPhotoModal, setShowPhotoModal]= useState(false);
  const [showCameraMenu, setShowCameraMenu]= useState(false);
  const [deletingPhoto,  setDeletingPhoto] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    axiosClient.get("/problem/getAllProblem").then(({ data }) => setProblems(data)).catch(() => {});
    axiosClient.get("/problem/problemSolvedByUser").then(({ data }) => setSolved(data)).catch(() => {});
    axiosClient.get("/submission/getUserSubmissions").then(({ data }) => setSubmissions(data)).catch(() => {}).finally(() => setLoadingSub(false));
  }, [user]);

  useEffect(() => {
    const fn = (e) => { if (cameraRef.current && !cameraRef.current.contains(e.target)) setShowCameraMenu(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Stats ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total  = problems.length;
    const solved = solvedProblems.length;
    const rank   = getRank(solved, total);

    const byDiff = (diff) => ({
      solved: solvedProblems.filter(sp => problems.find(p => p._id === sp._id && p.difficulty?.toLowerCase() === diff)).length,
      total:  problems.filter(p => p.difficulty?.toLowerCase() === diff).length,
    });

    const totalSubs    = submissions.length;
    const acceptedSubs = submissions.filter(s => s.status === "accepted").length;
    const accuracy     = totalSubs ? Math.round((acceptedSubs / totalSubs) * 100) : 0;
    const motivation   = getMotivation(solved, total, accuracy);

    return {
      total, solved, rank, totalSubs, acceptedSubs, accuracy, motivation,
      easy: byDiff("easy"), medium: byDiff("medium"), hard: byDiff("hard"),
    };
  }, [problems, solvedProblems, submissions]);

  // ── Delete photo ──────────────────────────────────────────
  const handleDeletePhoto = async () => {
    setShowCameraMenu(false);
    if (!window.confirm("Remove your profile picture?")) return;
    try {
      setDeletingPhoto(true);
      await axiosClient.delete("/user/delete-profile-picture");
      dispatch(updateProfilePicture(""));
    } catch { alert("Failed to delete photo"); }
    finally { setDeletingPhoto(false); }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#060b12", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "56px", borderBottom: "1px solid #131f33", background: "#0b1220", position: "sticky", top: 0, zIndex: 50 }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <defs><linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            <path d="M20 2L37 20L20 38L3 20Z" fill="url(#plg)" opacity="0.18" stroke="#6366f1" strokeWidth="1.2"/>
            <path d="M20 8L33 20L20 32L7 20Z" fill="#0c1425" stroke="#6366f1" strokeWidth="0.8" opacity="0.7"/>
            <path d="M17 14L11 20L17 26" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 14L29 20L23 26" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            <line x1="23" y1="13" x2="17" y2="27" stroke="url(#plg)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.04em" }}>
            Code<span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sage</span>
          </span>
        </div>
        <button onClick={() => navigate("/")}
          style={{ padding: "7px 18px", borderRadius: "8px", border: "1px solid #1e2d45", background: "transparent", color: "#94a3b8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e2d45"; e.currentTarget.style.color = "#94a3b8"; }}
        >← Problems</button>
      </nav>

      {/* ── Body ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px", display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: "300px", flexShrink: 0, position: "sticky", top: "72px", background: "#0b1220", borderRadius: "18px", border: "1px solid #131f33", overflow: "hidden", alignSelf: "flex-start" }}>

          {/* Shimmer */}
          <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }}/>

          {/* ── Avatar + Name ── */}
          <div style={{ padding: "28px 20px 20px", textAlign: "center" }}>

            {/* Avatar with camera popover */}
            <div ref={cameraRef} style={{ display: "inline-block", position: "relative", marginBottom: "16px" }}>
              <div
                style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "2px solid #6366f144", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#6366f144"}
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#6366f1,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px", fontWeight: 800, color: "#fff" }}>
                    {user.firstName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Camera badge */}
              <div
                onClick={() => setShowCameraMenu(!showCameraMenu)}
                style={{ position: "absolute", bottom: "2px", right: "2px", width: "28px", height: "28px", borderRadius: "50%", background: "#6366f1", border: "2px solid #060b12", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#7c3aed"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#6366f1"}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>

              {/* Camera popover */}
              {showCameraMenu && (
                <div style={{ position: "absolute", top: "110px", left: "50%", transform: "translateX(-50%)", background: "#0b1220", border: "1px solid #1e2d45", borderRadius: "12px", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 100, minWidth: "160px" }}>
                  <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)" }}/>
                  <button onClick={() => { setShowCameraMenu(false); setShowPhotoModal(true); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", color: "#818cf8", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#131f33"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    Change Photo
                  </button>
                  {user?.profilePicture && (
                    <button onClick={handleDeletePhoto} disabled={deletingPhoto}
                      style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", color: "#f87171", fontSize: "13px", fontWeight: 600, cursor: deletingPhoto ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", opacity: deletingPhoto ? 0.6 : 1 }}
                      onMouseEnter={(e) => { if (!deletingPhoto) e.currentTarget.style.background = "#131f33"; }}
                      onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                      {deletingPhoto ? "Removing..." : "Remove Photo"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "5px" }}>
              {user.firstName}
            </div>

            {/* Email */}
            <div style={{ fontSize: "12px", color: "#475569", marginBottom: "14px", wordBreak: "break-all" }}>
              {user.emailId || user.email}
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
              {user.role === "admin" && (
                <span style={{ background: "#1e1b4b", color: "#818cf8", border: "1px solid #6366f144", padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>
                  ⚡ ADMIN
                </span>
              )}
              <span style={{ background: "#0d1828", color: stats.rank.color, border: `1px solid ${stats.rank.color}33`, padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700 }}>
                {stats.rank.label}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#0d1828", margin: "0 20px" }}/>

          {/* ── Info rows ── */}
          <div style={{ padding: "16px 20px" }}>
            <InfoRow label="Joined"      value={joinDate} />
            <InfoRow label="Solved"      value={`${stats.solved} / ${stats.total}`} valueColor="#6366f1" />
            <InfoRow label="Submissions" value={stats.totalSubs} />
            <InfoRow label="Accepted"    value={stats.acceptedSubs} valueColor="#34d399" />
            <InfoRow label="Accuracy"    value={`${stats.accuracy}%`} valueColor={stats.accuracy >= 75 ? "#34d399" : stats.accuracy >= 50 ? "#fbbf24" : "#f87171"} last />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#0d1828", margin: "0 20px" }}/>

          
          {/* Divider */}
          <div style={{ height: "1px", background: "#0d1828", margin: "0 20px" }}/>

          {/* ── Motivation ── */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#2d3f5c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
              Status
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "#060b12", borderRadius: "10px", padding: "12px", border: "1px solid #0d1828" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{stats.rank.label.split(" ")[0]}</span>
              <span style={{ fontSize: "11px", color: "#475569", lineHeight: 1.7 }}>
                {stats.motivation}
              </span>
            </div>
          </div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Progress Panel */}
          <ProgressPanel problems={problems} solvedProblems={solvedProblems} compact={false} />

          {/* ── Recent Submissions ── */}
          <div style={{ background: "#0b1220", border: "1px solid #131f33", borderRadius: "14px", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #131f33", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Recent Submissions
              </span>
              {submissions.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", color: "#2d3f5c" }}>
                    {stats.acceptedSubs}/{stats.totalSubs} accepted
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    color: stats.accuracy >= 75 ? "#34d399" : stats.accuracy >= 50 ? "#fbbf24" : "#f87171",
                    background: stats.accuracy >= 75 ? "#0a3a2e" : stats.accuracy >= 50 ? "#3a2a00" : "#3a0a0a",
                    border: `1px solid ${stats.accuracy >= 75 ? "#34d39933" : stats.accuracy >= 50 ? "#fbbf2433" : "#f8717133"}`,
                    padding: "2px 8px", borderRadius: "999px",
                  }}>
                    {stats.accuracy}% accuracy
                  </span>
                </div>
              )}
            </div>

            {/* Column headers */}
            {!loadingSub && submissions.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 50px 65px", gap: "12px", padding: "8px 20px", background: "#060b12", borderBottom: "1px solid #0d1828" }}>
                {["Problem", "Status", "Lang", "Date"].map(h => (
                  <span key={h} style={{ fontSize: "10px", color: "#2d3f5c", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
            )}

            {/* Rows */}
            {loadingSub ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#2d3f5c", fontSize: "13px" }}>Loading...</div>
            ) : submissions.length === 0 ? (
              <div style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🚀</div>
                <div style={{ fontSize: "13px", color: "#2d3f5c" }}>No submissions yet — solve your first problem!</div>
              </div>
            ) : (
              submissions.slice(0, 10).map((sub, i) => {
                const st = getStatus(sub.status);
                const dc = diffColor(sub.problemId?.difficulty);
                return (
                  <div key={sub._id}
                    onClick={() => { if (sub.problemId?._id) navigate(`/problem/${sub.problemId._id}`); }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 110px 50px 65px", alignItems: "center", gap: "12px", padding: "13px 20px", borderBottom: i < Math.min(submissions.length, 10) - 1 ? "1px solid #0d1828" : "none", cursor: sub.problemId?._id ? "pointer" : "default", transition: "background 0.12s" }}
                    onMouseEnter={(e) => { if (sub.problemId?._id) e.currentTarget.style.background = "#0d1828"; }}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dc, flexShrink: 0 }}/>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: sub.problemId?.title ? "#e2e8f0" : "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: sub.problemId?.title ? "normal" : "italic" }}>
                        {sub.problemId?.title || "Deleted Problem"}
                      </span>
                    </div>
                    <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, textAlign: "center", display: "block" }}>
                      {st.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "#475569", background: "#131f33", padding: "2px 8px", borderRadius: "6px", textAlign: "center", display: "block" }}>
                      {getLang(sub.language)}
                    </span>
                    <span style={{ fontSize: "11px", color: "#2d3f5c", textAlign: "right" }}>
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showPhotoModal && <ProfilePicture onClose={() => setShowPhotoModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}