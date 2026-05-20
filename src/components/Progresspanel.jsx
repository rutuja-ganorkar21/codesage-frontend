
export default function ProgressPanel({ problems = [], solvedProblems = [], compact = false }) {

  const total  = problems.length;
  const solved = solvedProblems.length;
  const pct    = total ? Math.round((solved / total) * 100) : 0;

  const getDiff = (diff) => {
    const totalD  = problems.filter(p => p.difficulty?.toLowerCase() === diff).length;
    const solvedD = solvedProblems.filter(sp =>
      problems.find(p => p._id === sp._id && p.difficulty?.toLowerCase() === diff)
    ).length;
    const pctD = totalD ? Math.round((solvedD / totalD) * 100) : 0;
    return { totalD, solvedD, pctD };
  };

  const easy   = getDiff("easy");
  const medium = getDiff("medium");
  const hard   = getDiff("hard");

  const difficulties = [
    { label: "Easy",   color: "#34d399", data: easy   },
    { label: "Medium", color: "#fbbf24", data: medium },
    { label: "Hard",   color: "#f87171", data: hard   },
  ];

  const radius       = 54;
  const circumference = 2 * Math.PI * radius;
  const circleSize   = compact ? 120 : 160;
  const gap          = 4;

  const easyLen   = total ? (easy.solvedD   / total) * circumference : 0;
  const mediumLen = total ? (medium.solvedD / total) * circumference : 0;
  const hardLen   = total ? (hard.solvedD   / total) * circumference : 0;

  return (
    <div style={{
      background: "#0b1220",
      border: "1px solid #131f33",
      borderRadius: compact ? "14px" : "18px",
      padding: compact ? "18px 16px" : "24px",
      position: "relative",
    }}>

      {/* Top shimmer */}
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)",
        marginBottom: compact ? "14px" : "18px",
      }} />

      {/* Title */}
      <div style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "#475569",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: compact ? "14px" : "18px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        DSA Progress
      </div>

      {/* Circular Ring */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: compact ? "16px" : "22px" }}>
        <div style={{ position: "relative", width: `${circleSize}px`, height: `${circleSize}px` }}>
          <svg width={circleSize} height={circleSize} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a2a3a" strokeWidth={compact ? "9" : "11"} />
            {easy.solvedD > 0 && (
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#34d399"
                strokeWidth={compact ? "9" : "11"} strokeLinecap="butt"
                strokeDasharray={`${easyLen - gap} ${circumference - easyLen + gap}`}
                strokeDashoffset={0}
              />
            )}
            {medium.solvedD > 0 && (
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#fbbf24"
                strokeWidth={compact ? "9" : "11"} strokeLinecap="butt"
                strokeDasharray={`${mediumLen - gap} ${circumference - mediumLen + gap}`}
                strokeDashoffset={-(easyLen)}
              />
            )}
            {hard.solvedD > 0 && (
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#f87171"
                strokeWidth={compact ? "9" : "11"} strokeLinecap="butt"
                strokeDasharray={`${hardLen - gap} ${circumference - hardLen + gap}`}
                strokeDashoffset={-(easyLen + mediumLen)}
              />
            )}
          </svg>

          {/* Center text */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: compact ? "24px" : "32px", fontWeight: 800, color: "#f1f5f9", lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
              {solved}
            </span>
            <div style={{ width: "28px", height: "1px", background: "#1e2d45", margin: "5px 0" }} />
            <span style={{ fontSize: compact ? "12px" : "15px", fontWeight: 600, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
              {total}
            </span>
            {!compact && (
              <span style={{ fontSize: "10px", color: "#2d3f5c", marginTop: "3px", fontFamily: "'DM Sans', sans-serif" }}>
                solved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* % complete */}
      <div style={{ textAlign: "center", marginBottom: compact ? "16px" : "20px" }}>
        <span style={{ fontSize: compact ? "11px" : "13px", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
          {pct}% complete
        </span>
      </div>

      {/* Easy / Medium / Hard bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? "10px" : "14px" }}>
        {difficulties.map(({ label, color, data }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: compact ? "7px" : "9px", height: compact ? "7px" : "9px", borderRadius: "50%", background: color }} />
                <span style={{ fontSize: compact ? "12px" : "13px", color: "#94a3b8", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                  {label}
                </span>
              </div>
              <span style={{ fontSize: compact ? "12px" : "13px", fontWeight: 700, color, fontFamily: "'DM Sans', sans-serif" }}>
                {data.solvedD}
                <span style={{ color: "#2d3f5c", fontWeight: 400 }}>/{data.totalD}</span>
              </span>
            </div>
            <div style={{ height: compact ? "4px" : "5px", background: "#131f33", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${data.pctD}%`, background: color, borderRadius: "999px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}