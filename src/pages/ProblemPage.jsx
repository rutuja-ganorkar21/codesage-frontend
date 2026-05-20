


import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Editor from "@monaco-editor/react";
import { useMediaQuery } from "react-responsive";
import axiosClient from "../utils/axiosClient";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import { FileText, BookOpen, Lightbulb, Clock, Bot, Maximize2, Minimize2 } from "lucide-react";

function DifficultyBadge({ difficulty }) {
  const map = {
    easy: { label: "Easy", bg: "#0a3a2e", color: "#34d399" },
    medium: { label: "Medium", bg: "#3a2a00", color: "#fbbf24" },
    hard: { label: "Hard", bg: "#3a0a0a", color: "#f87171" },
  };
  const d = map[(difficulty || "easy").toLowerCase()] || map.easy;
  return (
    <span style={{ background: d.bg, color: d.color, padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em", border: `1px solid ${d.color}33` }}>
      {d.label}
    </span>
  );
}

function Tag({ label }) {
  return (
    <span style={{ background: "#1e293b", color: "#94a3b8", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, border: "1px solid #334155" }}>
      {label}
    </span>
  );
}

function Tabs({ tabs, active, setActive, scrollable }) {
  return (
    <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #1e293b", overflowX: scrollable ? "auto" : "visible", scrollbarWidth: "none" }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 14px", fontSize: "13px",
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? "#fff" : "#64748b",
            borderBottom: active === t.id ? "2px solid #6366f1" : "2px solid transparent",
            marginBottom: "-1px", transition: "color 0.15s",
            display: "flex", alignItems: "center", gap: "6px",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          {t.icon && <span style={{ opacity: active === t.id ? 1 : 0.5 }}>{t.icon}</span>}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    accepted: { label: "Accepted", color: "#34d399" },
    wrong: { label: "Wrong Answer", color: "#f87171" },
    error: { label: "Runtime Error", color: "#fb923c" },
    pending: { label: "Pending", color: "#94a3b8" },
  };
  const s = map[(status || "pending").toLowerCase()] || map.pending;
  return <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>;
}

function ConsoleDrawer({ isOpen, onToggle, runResult, actionLoading, visibleTestCases, selectedCaseIdx, setSelectedCaseIdx }) {
  const isPassed = (r) => r?.status?.id === 3;
  const getJudge0StatusLabel = (statusId) => {
    const map = { 3: "Accepted", 4: "Wrong Answer", 5: "Time Limit Exceeded", 6: "Compilation Error", 7: "Runtime Error", 8: "Runtime Error", 9: "Runtime Error", 10: "Runtime Error", 11: "Runtime Error", 12: "Runtime Error" };
    return map[statusId] || `Status ${statusId}`;
  };
  const results = Array.isArray(runResult) ? runResult : [];
  const allPassed = results.length > 0 && results.every((r) => isPassed(r));

  return (
    <div style={{ position: "absolute", bottom: "48px", left: 0, right: 0, background: "#0f172a", borderTop: "1px solid #1e293b", transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)", height: isOpen ? "260px" : "36px", overflow: "hidden", zIndex: 5, display: "flex", flexDirection: "column" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: "36px", minHeight: "36px", cursor: "pointer", userSelect: "none", borderBottom: isOpen ? "1px solid #1e293b" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, letterSpacing: "0.05em" }}>CONSOLE</span>
          {!isOpen && results.length > 0 && !actionLoading && (
            <span style={{ fontSize: "11px", fontWeight: 700, color: allPassed ? "#34d399" : "#f87171", background: allPassed ? "#0a3a2e" : "#3a0a0a", padding: "1px 8px", borderRadius: "999px", border: `1px solid ${allPassed ? "#34d39933" : "#f8717133"}` }}>
              {allPassed ? `✓ ${results.length}/${results.length} passed` : `✗ ${results.filter(isPassed).length}/${results.length} passed`}
            </span>
          )}
          {!isOpen && actionLoading && <span style={{ fontSize: "11px", color: "#6366f1" }}>Running…</span>}
        </div>
        <span style={{ color: "#334155", fontSize: "12px", transition: "transform 0.3s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▲</span>
      </div>

      {isOpen && (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {actionLoading ? (
            <div style={{ color: "#6366f1", fontSize: "13px", padding: "16px 0" }}>⏳ Running your code…</div>
          ) : results.length === 0 ? (
            <div style={{ color: "#334155", fontSize: "13px", padding: "8px 0" }}>Run your code to see test case results here.</div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                {results.map((r, i) => {
                  const passed = isPassed(r);
                  return (
                    <button key={i} onClick={() => setSelectedCaseIdx(i)}
                      style={{ padding: "3px 12px", borderRadius: "6px", border: selectedCaseIdx === i ? `1px solid ${passed ? "#34d399" : "#f87171"}` : "1px solid #1e293b", background: selectedCaseIdx === i ? (passed ? "#0a3a2e" : "#3a0a0a") : "#0d1117", color: selectedCaseIdx === i ? (passed ? "#34d399" : "#f87171") : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "10px" }}>●</span>Case {i + 1}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const r = results[selectedCaseIdx];
                const tc = visibleTestCases?.[selectedCaseIdx];
                const passed = isPassed(r);
                if (!r) return null;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                    <div style={{ color: passed ? "#34d399" : "#f87171", fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>
                      {passed ? "✅ Accepted" : `❌ ${getJudge0StatusLabel(r.status?.id)}`}
                    </div>
                    {[["INPUT", tc?.input ?? "—", "#e2e8f0", "#1e293b"], ["YOUR OUTPUT", r.stdout?.trim() || "No output", passed ? "#34d399" : "#f87171", passed ? "#166534" : "#7f1d1d"], ["EXPECTED OUTPUT", tc?.output ?? r.expected_output ?? "—", "#94a3b8", "#1e293b"]].map(([label, val, color, border]) => (
                      <div key={label}>
                        <div style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.04em" }}>{label}</div>
                        <div style={{ background: "#0d1117", borderRadius: "6px", padding: "8px 12px", color, fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", border: `1px solid ${border}` }}>{val}</div>
                      </div>
                    ))}
                    {r.stderr && (
                      <div>
                        <div style={{ color: "#fb923c", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>STDERR</div>
                        <div style={{ background: "#0d1117", borderRadius: "6px", padding: "8px 12px", color: "#fb923c", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", border: "1px solid #7c2d12", whiteSpace: "pre-wrap" }}>{r.stderr}</div>
                      </div>
                    )}
                    {r.compile_output && (
                      <div>
                        <div style={{ color: "#fb923c", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>COMPILE ERROR</div>
                        <div style={{ background: "#0d1117", borderRadius: "6px", padding: "8px 12px", color: "#fb923c", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", border: "1px solid #7c2d12", whiteSpace: "pre-wrap" }}>{r.compile_output}</div>
                      </div>
                    )}
                    {r.time && <div style={{ color: "#475569", fontSize: "11px" }}>Runtime: <span style={{ color: "#64748b" }}>{r.time}s</span></div>}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState("");
  const [leftTab, setLeftTab] = useState("description");
  const [rightTab, setRightTab] = useState("code");
  const [mobileTab, setMobileTab] = useState("problem");
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [testcaseTab, setTestcaseTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const LANGS = [
    { id: "javascript", label: "JavaScript" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
  ];
  const monacoLang = { javascript: "javascript", java: "java", cpp: "cpp" };

  useEffect(() => {
    if (!problemId) return;
    setLoading(true);
    axiosClient.get(`/problem/problemById/${problemId}`)
      .then(({ data }) => {
        setProblem(data);
        const starter = data.startCode?.find((s) => s.language?.toLowerCase() === "javascript");
        if (starter) setCode(starter.initialCode || "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [problemId]);

  useEffect(() => {
    if (!problem) return;
    const starter = problem.startCode?.find((s) => s.language?.toLowerCase() === selectedLang.toLowerCase());
    setCode(starter?.initialCode || "");
  }, [selectedLang, problem]);

  useEffect(() => {
    if (leftTab !== "submissions" || !problemId) return;
    axiosClient.get(`/problem/submittedProblem/${problemId}`)
      .then(({ data }) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]));
  }, [leftTab, problemId]);

  const handleRun = async () => {
    setActionLoading(true);
    setConsoleOpen(true);
    setRunResult(null);
    setSubmitResult(null);
    setSelectedCaseIdx(0);
    if (isMobile) setMobileTab("code");
    try {
      const { data } = await axiosClient.post(`/submission/runcode/${problemId}`, { code, language: selectedLang });
      setRunResult(data);
    } catch (err) {
      setRunResult({ error: err?.response?.data || "Run failed" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setRightTab("result");
    setSubmitResult(null);
    setRunResult(null);
    setConsoleOpen(false);
    if (isMobile) setMobileTab("code");
    try {
      const { data } = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLang });
      setSubmitResult(data);
    } catch (err) {
      setSubmitResult({ error: err?.response?.data || "Submit failed" });
    } finally {
      setActionLoading(false);
    }
  };

  const styles = {
    root: { display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117", color: "#e2e8f0", fontFamily: "'Geist', 'DM Sans', sans-serif", overflow: "hidden" },
    navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 12px" : "0 20px", height: "48px", minHeight: "48px", background: "#0d1117", borderBottom: "1px solid #1e293b", zIndex: 10 },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    left: { width: isFullscreen ? "0%" : "50%", display: isFullscreen ? "none" : "flex", flexDirection: "column", borderRight: "1px solid #1e293b", overflow: "hidden", transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)" },
    leftContent: { flex: 1, overflowY: "auto", padding: "20px 24px" },
    right: { width: isFullscreen ? "100%" : "50%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)" },
    rightToolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: "#0f172a", borderBottom: "1px solid #1e293b" },
    bottomBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderTop: "1px solid #1e293b", background: "#0f172a", height: "48px", minHeight: "48px", zIndex: 6, position: "relative" },
    btnPrimary: { padding: isMobile ? "7px 16px" : "7px 22px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "0.02em", transition: "background 0.15s" },
    btnSecondary: { padding: isMobile ? "7px 12px" : "7px 22px", borderRadius: "8px", border: "1px solid #334155", cursor: "pointer", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: "13px", transition: "background 0.15s" },
    langBtn: (active) => ({ padding: "4px 12px", borderRadius: "6px", border: active ? "1px solid #6366f1" : "1px solid #1e293b", background: active ? "#1e1b4b" : "transparent", color: active ? "#a5b4fc" : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }),
    fullscreenBtn: { display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "6px", border: "1px solid #1e293b", background: isFullscreen ? "#1e1b4b" : "transparent", color: isFullscreen ? "#a5b4fc" : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" },
  };

  if (loading) return <div style={{ ...styles.root, alignItems: "center", justifyContent: "center" }}><div style={{ color: "#6366f1", fontSize: "14px" }}>Loading problem…</div></div>;
  if (!problem) return <div style={{ ...styles.root, alignItems: "center", justifyContent: "center" }}><div style={{ color: "#f87171" }}>Problem not found.</div></div>;

  const renderLeftTab = () => {
    switch (leftTab) {
      case "description":
        return (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px", color: "#f1f5f9" }}>{problem.title}</h1>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              <DifficultyBadge difficulty={problem.difficulty} />
              {(problem.tags || []).map((t) => <Tag key={t} label={t} />)}
            </div>
            <p style={{ color: "#94a3b8", lineHeight: "1.75", fontSize: "14px", marginBottom: "24px" }}>{problem.description}</p>
            {(problem.visibleTestCases || []).map((tc, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: "10px", padding: "14px 18px", marginBottom: "14px", border: "1px solid #1e293b" }}>
                <div style={{ fontWeight: 700, marginBottom: "8px", color: "#e2e8f0" }}>Example {i + 1}:</div>
                <div style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: "1.8" }}>
                  <div><span style={{ color: "#e2e8f0", fontWeight: 600 }}>Input:</span> {tc.input}</div>
                  <div><span style={{ color: "#e2e8f0", fontWeight: 600 }}>Output:</span> {tc.output}</div>
                  {tc.explanation && <div><span style={{ color: "#e2e8f0", fontWeight: 600 }}>Explanation:</span> {tc.explanation}</div>}
                </div>
              </div>
            ))}
          </>
        );
      case "editorial": return <Editorial problem={problem} />;
      case "solutions":
        return (
          <div style={{ marginTop: "10px" }}>
            {problem.referenceSolution?.map((sol, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: "12px", marginBottom: "16px", border: "1px solid #1e293b", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "8px", background: "#0d1117" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: sol.language === "javascript" ? "#fbbf24" : sol.language === "java" ? "#f87171" : "#60a5fa" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>{sol.language === "cpp" ? "C++" : sol.language === "java" ? "Java" : "JavaScript"}</span>
                </div>
                <pre style={{ fontSize: "12.5px", color: "#e2e8f0", padding: "16px 18px", overflowX: "auto", whiteSpace: "pre-wrap", lineHeight: "1.7", fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{sol.completeCode}</pre>
              </div>
            ))}
          </div>
        );
      case "submissions":
        return (
          <div style={{ marginTop: "8px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9" }}>My Submissions</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Showing {submissions.length} submission{submissions.length !== 1 ? "s" : ""}</div>
            </div>
            {submissions.length === 0 ? (
              <div style={{ color: "#64748b", textAlign: "center", marginTop: "40px" }}>No submissions yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: isMobile ? "500px" : "auto" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b", color: "#64748b" }}>
                      {["Status", "Runtime", "Memory", "Test Cases", "Submitted", "Actions"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 6px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "10px 6px" }}><StatusBadge status={s.status} /></td>
                        <td style={{ padding: "10px 6px", color: "#94a3b8" }}>{s.runtime ? `${Number(s.runtime).toFixed(3)}s` : "–"}</td>
                        <td style={{ padding: "10px 6px", color: "#94a3b8" }}>{s.memory ? `${s.memory} KB` : "–"}</td>
                        <td style={{ padding: "10px 6px", color: "#94a3b8" }}>{s.testCasesPassed}/{s.testCasesTotal}</td>
                        <td style={{ padding: "10px 6px", color: "#64748b", fontSize: "12px" }}>{s.createdAt ? new Date(s.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–"}</td>
                        <td style={{ padding: "10px 6px" }}>
                          <button onClick={() => { setSelectedSubmission(s); setShowCodeModal(true); }}
                            style={{ padding: "4px 14px", borderRadius: "6px", border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                            onMouseEnter={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.color = "#a5b4fc"; }}
                            onMouseLeave={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#94a3b8"; }}
                          >Code</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {showCodeModal && selectedSubmission && (
              <div onClick={() => setShowCodeModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", width: "640px", maxWidth: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "14px" }}>Submission Code</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{selectedSubmission.language} &nbsp;•&nbsp; <StatusBadge status={selectedSubmission.status} /></div>
                    </div>
                    <button onClick={() => setShowCodeModal(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "20px", cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ overflowY: "auto", padding: "16px 20px" }}>
                    <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "#e2e8f0", background: "#0d1117", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", overflowX: "auto", whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
                      {selectedSubmission.code}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "chatai":
        return <div style={{ height: "100%", overflowY: "auto" }}><ChatAi problem={problem} /></div>;
      default: return null;
    }
  };

  const renderRightContent = () => {
    if (rightTab === "code") {
      return (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Editor
            height="100%"
            language={monacoLang[selectedLang] || "javascript"}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{ fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace", fontLigatures: true, minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: "on", renderLineHighlight: "line", padding: { top: 16, bottom: 16 }, tabSize: 2, wordWrap: "on", smoothScrolling: true, cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on" }}
          />
        </div>
      );
    }
    if (rightTab === "testcase") {
      const cases = problem.visibleTestCases || [];
      return (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", fontSize: "13px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {cases.map((_, i) => (
              <button key={i} onClick={() => setTestcaseTab(i)}
                style={{ padding: "5px 16px", borderRadius: "7px", border: testcaseTab === i ? "1px solid #6366f1" : "1px solid #1e293b", background: testcaseTab === i ? "#1e1b4b" : "#0f172a", color: testcaseTab === i ? "#a5b4fc" : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Case {i + 1}
              </button>
            ))}
          </div>
          {cases[testcaseTab] && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[["INPUT", cases[testcaseTab].input], ["EXPECTED OUTPUT", cases[testcaseTab].output]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.04em" }}>{label}</div>
                  <div style={{ background: "#0d1117", borderRadius: "8px", padding: "12px 14px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", border: "1px solid #1e293b", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{val}</div>
                </div>
              ))}
              {cases[testcaseTab].explanation && (
                <div>
                  <div style={{ color: "#64748b", fontSize: "11px", fontWeight: 600, marginBottom: "6px" }}>EXPLANATION</div>
                  <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.7" }}>{cases[testcaseTab].explanation}</div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    if (rightTab === "result") {
      if (actionLoading) return <div style={{ color: "#6366f1", fontSize: "14px", padding: "24px" }}>⏳ Submitting your code…</div>;
      if (submitResult) {
        if (submitResult.error) return <div style={{ color: "#f87171", padding: "12px" }}>{String(submitResult.error)}</div>;
        const accepted = submitResult.status === "accepted";
        return (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ background: "#0f172a", borderRadius: "12px", padding: "20px 24px", border: `1px solid ${accepted ? "#166534" : "#7f1d1d"}` }}>
              <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "14px", color: accepted ? "#34d399" : "#f87171" }}>
                {accepted ? "🎉 Accepted!" : "❌ " + (submitResult.status === "wrong" ? "Wrong Answer" : "Runtime Error")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr", gap: "12px" }}>
                {[["Test Cases", `${submitResult.testCasesPassed} / ${submitResult.testCasesTotal}`], ["Runtime", submitResult.runtime ? `${Number(submitResult.runtime).toFixed(3)}s` : "–"], ["Memory", submitResult.memory ? `${submitResult.memory} KB` : "–"], ["Language", submitResult.language]].map(([label, val]) => (
                  <div key={label} style={{ background: "#1e293b", borderRadius: "8px", padding: "10px 14px" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{label}</div>
                    <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "15px" }}>{val}</div>
                  </div>
                ))}
              </div>
              {submitResult.errorMessage && <pre style={{ marginTop: "14px", color: "#f87171", fontSize: "12px", background: "#1e293b", borderRadius: "8px", padding: "10px", overflowX: "auto", whiteSpace: "pre-wrap" }}>{submitResult.errorMessage}</pre>}
            </div>
          </div>
        );
      }
      return <div style={{ color: "#334155", fontSize: "14px", padding: "24px" }}>Submit your code to see results here.</div>;
    }
    return null;
  };

  // ── MOBILE LAYOUT ────────────────────────
  if (isMobile) {
    return (
      <div style={styles.root}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <defs><linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
              <path d="M20 2L37 20L20 38L3 20Z" fill="url(#plg)" opacity="0.18" stroke="#6366f1" strokeWidth="1.2" />
              <path d="M20 8L33 20L20 32L7 20Z" fill="#0c1425" stroke="#6366f1" strokeWidth="0.8" opacity="0.7" />
              <path d="M17 14L11 20L17 26" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 14L29 20L23 26" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <line x1="23" y1="13" x2="17" y2="27" stroke="url(#plg)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.04em" }}>
              Code<span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sage</span>
            </span>
          </div>

          <div style={{ display: "flex", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", overflow: "hidden" }}>
            {[{ id: "problem", label: "Problem" }, { id: "code", label: "Code" }].map(t => (
              <button key={t.id} onClick={() => setMobileTab(t.id)}
                style={{ padding: "6px 14px", background: mobileTab === t.id ? "#1e1b4b" : "transparent", border: "none", color: mobileTab === t.id ? "#a5b4fc" : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Problem Panel */}
        {mobileTab === "problem" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Tabs scrollable tabs={[
              { id: "description", label: "Description", icon: <FileText size={12} /> },
              { id: "editorial", label: "Editorial", icon: <BookOpen size={12} /> },
              { id: "solutions", label: "Solutions", icon: <Lightbulb size={12} /> },
              { id: "submissions", label: "Submissions", icon: <Clock size={12} /> },
              { id: "chatai", label: "ChatAI", icon: <Bot size={12} /> },
            ]} active={leftTab} setActive={setLeftTab} />
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>{renderLeftTab()}</div>
          </div>
        )}

        {/* Mobile Code Panel */}
        {mobileTab === "code" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", background: "#0f172a", borderBottom: "1px solid #1e293b" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[{ id: "code", label: "Code" }, { id: "testcase", label: "Testcase" }, { id: "result", label: "Result" }].map(t => (
                  <button key={t.id} onClick={() => setRightTab(t.id)} style={styles.langBtn(rightTab === t.id)}>{t.label}</button>
                ))}
              </div>
              {rightTab === "code" && (
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}
                  style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: "7px", padding: "4px 8px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, cursor: "pointer", outline: "none" }}>
                  {LANGS.map(l => <option key={l.id} value={l.id} style={{ background: "#0d1117" }}>{l.label}</option>)}
                </select>
              )}
            </div>

            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingBottom: consoleOpen ? "308px" : "36px", transition: "padding-bottom 0.3s" }}>
              {renderRightContent()}
            </div>

            <ConsoleDrawer isOpen={consoleOpen} onToggle={() => setConsoleOpen(v => !v)} runResult={runResult} actionLoading={actionLoading} visibleTestCases={problem.visibleTestCases} selectedCaseIdx={selectedCaseIdx} setSelectedCaseIdx={setSelectedCaseIdx} />

            <div style={styles.bottomBar}>
              <div style={{ display: "flex", gap: "8px" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.btnSecondary} onClick={handleRun} disabled={actionLoading}>
                  {actionLoading && !submitResult ? "Running…" : "▶ Run"}
                </button>
                <button style={{ ...styles.btnPrimary, opacity: actionLoading ? 0.6 : 1 }} onClick={handleSubmit} disabled={actionLoading}>
                  {actionLoading && submitResult === null && runResult === null ? "Submitting…" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: #0d1117; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        `}</style>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ───────────────────────
  return (
    <div style={styles.root}>
      <div style={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <defs><linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
              <path d="M20 2L37 20L20 38L3 20Z" fill="url(#plg)" opacity="0.18" stroke="#6366f1" strokeWidth="1.2" />
              <path d="M20 8L33 20L20 32L7 20Z" fill="#0c1425" stroke="#6366f1" strokeWidth="0.8" opacity="0.7" />
              <path d="M17 14L11 20L17 26" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 14L29 20L23 26" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <line x1="23" y1="13" x2="17" y2="27" stroke="url(#plg)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.04em" }}>
              Code<span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sage</span>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.btnSecondary} onClick={() => navigate("/")}>← Problems</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Left */}
        <div style={styles.left}>
          <Tabs tabs={[
            { id: "description", label: "Description", icon: <FileText size={13} /> },
            { id: "editorial", label: "Editorial", icon: <BookOpen size={13} /> },
            { id: "solutions", label: "Solutions", icon: <Lightbulb size={13} /> },
            { id: "submissions", label: "Submissions", icon: <Clock size={13} /> },
            { id: "chatai", label: "ChatAI", icon: <Bot size={13} /> },
          ]} active={leftTab} setActive={setLeftTab} />
          <div style={styles.leftContent}>{renderLeftTab()}</div>
        </div>

        {/* Right */}
        <div style={styles.right}>
          <div style={styles.rightToolbar}>
            <div style={{ display: "flex", gap: "4px" }}>
              {[{ id: "code", label: "Code" }, { id: "testcase", label: "Testcase" }, { id: "result", label: "Result" }].map(t => (
                <button key={t.id} onClick={() => setRightTab(t.id)} style={{ ...styles.langBtn(rightTab === t.id), padding: "4px 14px" }}>{t.label}</button>
              ))}
            </div>
            {rightTab === "code" && (
              <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}
                style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: "7px", padding: "4px 10px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
                {LANGS.map(l => <option key={l.id} value={l.id} style={{ background: "#0d1117" }}>{l.label}</option>)}
              </select>
            )}
          </div>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingBottom: consoleOpen ? "308px" : "36px", transition: "padding-bottom 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
            {renderRightContent()}
          </div>
          <ConsoleDrawer isOpen={consoleOpen} onToggle={() => setConsoleOpen(v => !v)} runResult={runResult} actionLoading={actionLoading} visibleTestCases={problem.visibleTestCases} selectedCaseIdx={selectedCaseIdx} setSelectedCaseIdx={setSelectedCaseIdx} />

          {/* Bottom bar — fullscreen toggle on left, Run+Submit on right */}
          <div style={styles.bottomBar}>
            <button
              style={styles.fullscreenBtn}
              onClick={() => setIsFullscreen(v => !v)}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen editor"}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? "Exit" : "Expand"}</span>
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button style={styles.btnSecondary} onClick={handleRun} disabled={actionLoading}>
                {actionLoading && !submitResult ? "Running…" : "▶ Run"}
              </button>
              <button style={{ ...styles.btnPrimary, opacity: actionLoading ? 0.6 : 1 }} onClick={handleSubmit} disabled={actionLoading}>
                {actionLoading && submitResult === null && runResult === null ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
