
import { useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";

const TAGS = [
  "array",
  "string",
  "linked list",
  "dynamic programming",
  "greedy",
  "tree",
  "graph",
  "hash table",
  "two pointers",
  "sliding window",
];

const LANGUAGES = ["javascript", "java", "cpp"];

const LANG_LABELS = {
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

const STARTER = {
  javascript: `function solve() {\n  const lines = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');\n  // write your code here\n}\nsolve();`,
  java: `import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // write your code here\n  }\n}`,
  cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n  // write your code here\n}`,
};

// ── Styles ──────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: "#0d1117",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Outfit', sans-serif",
    padding: "32px 24px 80px",
  },
  inner: { maxWidth: "100%", padding: "0 40px" },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "36px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: 800,
    color: "#6366f1",
    letterSpacing: "-0.03em",
    cursor: "pointer",
  },
  heading: { fontSize: "24px", fontWeight: 700, color: "#f1f5f9" },
  sub: { fontSize: "13px", color: "#64748b", marginTop: "4px" },
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "18px",
    paddingBottom: "12px",
    borderBottom: "1px solid #1e293b",
  },
  label: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 600,
    marginBottom: "6px",
    letterSpacing: "0.03em",
    display: "block",
  },
  input: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  },
  textarea: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: "1.7",
  },
  codearea: {
    width: "100%",
    background: "#0d1117",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12.5px",
    color: "#e2e8f0",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineHeight: "1.7",
  },
  select: {
    background: "#0d1117",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f0",
    outline: "none",
    cursor: "pointer",
  },
  row: { display: "flex", gap: "14px", marginBottom: "14px" },
  col: { flex: 1 },
  btnAdd: {
    padding: "6px 16px",
    borderRadius: "7px",
    border: "1px solid #6366f1",
    background: "transparent",
    color: "#a5b4fc",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnRemove: {
    padding: "4px 12px",
    borderRadius: "6px",
    border: "1px solid #7f1d1d",
    background: "transparent",
    color: "#f87171",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSubmit: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.15s",
    marginTop: "8px",
  },
  tcCard: {
    background: "#0d1117",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
  },
  tcNum: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6366f1",
    marginBottom: "10px",
  },
  tagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "4px",
  },
  langTab: (active) => ({
    padding: "6px 16px",
    borderRadius: "7px",
    border: active ? "1px solid #6366f1" : "1px solid #1e293b",
    background: active ? "#1e1b4b" : "transparent",
    color: active ? "#a5b4fc" : "#64748b",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  toast: (type) => ({
    position: "fixed",
    top: "24px",
    right: "24px",
    background: type === "success" ? "#0a3a2e" : "#3a0a0a",
    border: `1px solid ${type === "success" ? "#34d399" : "#f87171"}`,
    color: type === "success" ? "#34d399" : "#f87171",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    zIndex: 999,
    animation: "fadeIn 0.2s ease",
  }),
  sectionDivider: {
    borderBottom: "1px solid #1e293b",
    marginBottom: "16px",
    paddingBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
};

// ── Main Component ───────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();

  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedTags, setSelectedTags] = useState([]);
  const [editorial, setEditorial] = useState("");

  // Test cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
  ]);

  // Code — per language
  const [startCode, setStartCode] = useState({
    javascript: STARTER.javascript,
    java: STARTER.java,
    cpp: STARTER.cpp,
  });
  const [referenceSolution, setReferenceSolution] = useState({
    javascript: "",
    java: "",
    cpp: "",
  });

  // Active lang tab
  const [activeLang, setActiveLang] = useState("javascript");

  // UI state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, msg }

  // ── Helpers ────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Visible test cases
  const addVisible = () =>
    setVisibleTestCases((p) => [
      ...p,
      { input: "", output: "", explanation: "" },
    ]);
  const removeVisible = (i) =>
    setVisibleTestCases((p) => p.filter((_, idx) => idx !== i));
  const updateVisible = (i, field, val) =>
    setVisibleTestCases((p) =>
      p.map((tc, idx) => (idx === i ? { ...tc, [field]: val } : tc)),
    );

  // Hidden test cases
  const addHidden = () =>
    setHiddenTestCases((p) => [...p, { input: "", output: "" }]);
  const removeHidden = (i) =>
    setHiddenTestCases((p) => p.filter((_, idx) => idx !== i));
  const updateHidden = (i, field, val) =>
    setHiddenTestCases((p) =>
      p.map((tc, idx) => (idx === i ? { ...tc, [field]: val } : tc)),
    );

  // ── Submit ─────────────────────────────────
  const handleSubmit = async () => {
    // Basic validation
    if (!title.trim()) return showToast("error", "Title is required");
    if (!description.trim())
      return showToast("error", "Description is required");
    if (selectedTags.length === 0)
      return showToast("error", "Select at least one tag");
    if (visibleTestCases.some((tc) => !tc.input || !tc.output))
      return showToast("error", "Fill all visible test case fields");
    if (hiddenTestCases.some((tc) => !tc.input || !tc.output))
      return showToast("error", "Fill all hidden test case fields");
    if (LANGUAGES.some((l) => !referenceSolution[l].trim()))
      return showToast(
        "error",
        "Reference solution required for all languages",
      );

    const payload = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      tags: selectedTags,
      editorial: editorial.trim(),
      visibleTestCases,
      hiddenTestCases,
      startCode: LANGUAGES.map((l) => ({
        language: l,
        initialCode: startCode[l],
      })),
      referenceSolution: LANGUAGES.map((l) => ({
        language: l,
        completeCode: referenceSolution[l],
      })),
    };

    try {
      setLoading(true);
      await axiosClient.post("/problem/create", payload);
      showToast("success", "Problem created successfully! 🎉");
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("easy");
      setSelectedTags([]);
      setEditorial("");
      setVisibleTestCases([{ input: "", output: "", explanation: "" }]);
      setHiddenTestCases([{ input: "", output: "" }]);
      setStartCode({
        javascript: STARTER.javascript,
        java: STARTER.java,
        cpp: STARTER.cpp,
      });
      setReferenceSolution({ javascript: "", java: "", cpp: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Something went wrong";
      showToast("error", String(msg));
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────
  return (
    <div style={s.root}>
      {/* Toast */}
      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}

      <div style={s.inner}>
        {/* Navbar */}
        <div style={s.navbar}>
          <div>
            <div style={s.heading}>Admin Panel</div>
            <div style={s.sub}>Create a new coding problem</div>
          </div>
          
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
                <linearGradient id="alg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path
                d="M20 2L37 20L20 38L3 20Z"
                fill="url(#alg)"
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
                stroke="url(#alg)"
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
        </div>

        {/* ── Basic Info ── */}
        <div style={s.card}>
          <div style={s.cardTitle}>Basic Information</div>

          <div style={{ marginBottom: "14px" }}>
            <label style={s.label}>Title</label>
            <input
              style={s.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reverse a String"
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.textarea, minHeight: "100px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write the problem statement..."
              rows={5}
            />
          </div>

          <div style={s.row}>
            <div style={s.col}>
              <label style={s.label}>Difficulty</label>
              <select
                style={{ ...s.select, width: "100%" }}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label style={s.label}>Tags (select multiple)</label>
            <div style={s.tagGrid}>
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      border: active
                        ? "1px solid #6366f1"
                        : "1px solid #1e293b",
                      background: active ? "#1e1b4b" : "transparent",
                      color: active ? "#a5b4fc" : "#64748b",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Editorial ── */}
        <div style={s.card}>
          <div style={s.cardTitle}>Editorial</div>
          <textarea
            style={{ ...s.textarea, minHeight: "120px" }}
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            placeholder="Explain the approach, algorithm, time & space complexity..."
            rows={6}
          />
        </div>

        {/* ── Visible Test Cases ── */}
        <div style={s.card}>
          <div style={s.sectionDivider}>
            <div
              style={{
                ...s.cardTitle,
                marginBottom: 0,
                paddingBottom: 0,
                borderBottom: "none",
              }}
            >
              Visible Test Cases
            </div>
            <button style={s.btnAdd} onClick={addVisible}>
              + Add Case
            </button>
          </div>

          {visibleTestCases.map((tc, i) => (
            <div key={i} style={s.tcCard}>
              <div style={s.tcNum}>Case {i + 1}</div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Input</label>
                <textarea
                  style={{ ...s.codearea, minHeight: "60px" }}
                  value={tc.input}
                  onChange={(e) => updateVisible(i, "input", e.target.value)}
                  placeholder="Input value"
                  rows={2}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Output</label>
                <input
                  style={s.input}
                  value={tc.output}
                  onChange={(e) => updateVisible(i, "output", e.target.value)}
                  placeholder="Expected output"
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Explanation</label>
                <input
                  style={s.input}
                  value={tc.explanation}
                  onChange={(e) =>
                    updateVisible(i, "explanation", e.target.value)
                  }
                  placeholder="Brief explanation"
                />
              </div>
              {visibleTestCases.length > 1 && (
                <button style={s.btnRemove} onClick={() => removeVisible(i)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Hidden Test Cases ── */}
        <div style={s.card}>
          <div style={s.sectionDivider}>
            <div
              style={{
                ...s.cardTitle,
                marginBottom: 0,
                paddingBottom: 0,
                borderBottom: "none",
              }}
            >
              Hidden Test Cases
            </div>
            <button style={s.btnAdd} onClick={addHidden}>
              + Add Case
            </button>
          </div>

          {hiddenTestCases.map((tc, i) => (
            <div key={i} style={s.tcCard}>
              <div style={s.tcNum}>Case {i + 1}</div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Input</label>
                <textarea
                  style={{ ...s.codearea, minHeight: "60px" }}
                  value={tc.input}
                  onChange={(e) => updateHidden(i, "input", e.target.value)}
                  placeholder="Input value"
                  rows={2}
                />
              </div>
              <div>
                <label style={s.label}>Output</label>
                <input
                  style={s.input}
                  value={tc.output}
                  onChange={(e) => updateHidden(i, "output", e.target.value)}
                  placeholder="Expected output"
                />
              </div>
              {hiddenTestCases.length > 1 && (
                <button
                  style={{ ...s.btnRemove, marginTop: "10px" }}
                  onClick={() => removeHidden(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Code Templates + Reference Solution ── */}
        <div style={s.card}>
          <div style={s.cardTitle}>Code Templates & Reference Solutions</div>

          {/* Language tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l}
                style={s.langTab(activeLang === l)}
                onClick={() => setActiveLang(l)}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {/* Starter Code */}
          <div style={{ marginBottom: "16px" }}>
            <label style={s.label}>
              Starter Code — {LANG_LABELS[activeLang]}
            </label>
            <textarea
              style={{ ...s.codearea, minHeight: "140px" }}
              value={startCode[activeLang]}
              onChange={(e) =>
                setStartCode((p) => ({ ...p, [activeLang]: e.target.value }))
              }
              rows={7}
              spellCheck={false}
            />
          </div>

          {/* Reference Solution */}
          <div>
            <label style={s.label}>
              Reference Solution — {LANG_LABELS[activeLang]}
              <span style={{ color: "#f87171", marginLeft: "4px" }}>*</span>
            </label>
            <textarea
              style={{ ...s.codearea, minHeight: "140px" }}
              value={referenceSolution[activeLang]}
              onChange={(e) =>
                setReferenceSolution((p) => ({
                  ...p,
                  [activeLang]: e.target.value,
                }))
              }
              placeholder={`Complete working solution in ${LANG_LABELS[activeLang]}`}
              rows={7}
              spellCheck={false}
            />
          </div>
        </div>

        {/* ── Submit Button ── */}
        <button
          style={{ ...s.btnSubmit, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Problem…" : "Create Problem"}
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, textarea:focus, select:focus { border-color: #6366f1 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
