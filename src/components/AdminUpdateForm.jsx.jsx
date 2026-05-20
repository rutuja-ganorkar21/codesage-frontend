import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
  "sliding window"
];

const LANGUAGES = ["javascript", "java", "cpp"];
const LANG_LABELS = { javascript: "JavaScript", java: "Java", cpp: "C++" };

export default function AdminUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedTags, setSelectedTags] = useState([]);
  const [editorial, setEditorial] = useState("");

  // Test cases
  const [visibleTestCases, setVisibleTestCases] = useState([]);
  const [hiddenTestCases, setHiddenTestCases] = useState([]);

  // Code
  const [startCode, setStartCode] = useState({
    javascript: "",
    java: "",
    cpp: "",
  });
  const [referenceSolution, setReferenceSolution] = useState({
    javascript: "",
    java: "",
    cpp: "",
  });

  const [activeLang, setActiveLang] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch problem data
  useEffect(() => {
    if (!id) return;
    axiosClient
      .get(`/problem/problemById/${id}`)
      .then(({ data }) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDifficulty(data.difficulty || "easy");
        setSelectedTags(data.tags || []);
        setEditorial(data.editorial || "");
        setVisibleTestCases(data.visibleTestCases || []);
        setHiddenTestCases(data.hiddenTestCases || []);

        // startCode
        const sc = { javascript: "", java: "", cpp: "" };
        (data.startCode || []).forEach((s) => {
          const lang = s.language?.toLowerCase().trim();
          if (lang === "cpp" || lang === "c++") sc["cpp"] = s.initialCode;
          else sc[lang] = s.initialCode;
        });
        setStartCode(sc);

        // referenceSolution
        const rs = { javascript: "", java: "", cpp: "" };
        (data.referenceSolution || []).forEach((s) => {
          const lang = s.language?.toLowerCase().trim();
          if (lang === "cpp" || lang === "c++") rs["cpp"] = s.completeCode;
          else rs[lang] = s.completeCode;
        });
        setReferenceSolution(rs);
      })
      .catch(() => showToast("error", "Failed to load problem"))
      .finally(() => setLoading(false));
  }, [id]);

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

  const handleUpdate = async () => {
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
      setSubmitLoading(true);
      await axiosClient.put(`/problem/update/${id}`, payload);
      showToast("success", "Problem updated successfully! 🎉");
      setTimeout(() => navigate("/admin/update"), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Something went wrong";
      showToast("error", String(msg));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Styles
  const s = {
    input: {
      width: "100%",
      background: "#0d1117",
      border: "1px solid #1e293b",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "13px",
      color: "#e2e8f0",
      outline: "none",
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
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: "1.7",
    },
    label: {
      fontSize: "12px",
      color: "#64748b",
      fontWeight: 600,
      marginBottom: "6px",
      letterSpacing: "0.03em",
      display: "block",
    },
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
    tcCard: {
      background: "#0d1117",
      border: "1px solid #1e293b",
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "12px",
    },
    btnAdd: {
      padding: "6px 16px",
      borderRadius: "7px",
      border: "1px solid #6366f1",
      background: "transparent",
      color: "#a5b4fc",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
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
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#6366f1", fontSize: "14px" }}>
          Loading problem…
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        padding: "0 0 80px",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: toast.type === "success" ? "#0a3a2e" : "#3a0a0a",
            border: `1px solid ${toast.type === "success" ? "#34d399" : "#f87171"}`,
            color: toast.type === "success" ? "#34d399" : "#f87171",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            zIndex: 999,
          }}
        >
          {toast.msg}
        </div>
      )}

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
          marginBottom: "36px",
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
          onClick={() => navigate("/admin/update")}
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

      <div style={{ maxWidth: "100%", padding: "0 40px" }}>
        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9" }}>
            Edit Problem
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Update the problem details below
          </p>
        </div>

        {/* Basic Info */}
        <div style={s.card}>
          <div style={s.cardTitle}>Basic Information</div>
          <div style={{ marginBottom: "14px" }}>
            <label style={s.label}>Title</label>
            <input
              style={s.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Problem title"
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.textarea, minHeight: "100px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={s.label}>Difficulty</label>
            <select
              style={{
                background: "#0d1117",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#e2e8f0",
                outline: "none",
                cursor: "pointer",
                width: "200px",
              }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
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

        {/* Editorial */}
        <div style={s.card}>
          <div style={s.cardTitle}>Editorial</div>
          <textarea
            style={{ ...s.textarea, minHeight: "120px" }}
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
            placeholder="Explain the approach..."
            rows={6}
          />
        </div>

        {/* Visible Test Cases */}
        <div style={s.card}>
          <div
            style={{
              ...s.cardTitle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Visible Test Cases</span>
            <button style={s.btnAdd} onClick={addVisible}>
              + Add Case
            </button>
          </div>
          {visibleTestCases.map((tc, i) => (
            <div key={i} style={s.tcCard}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6366f1",
                  marginBottom: "10px",
                }}
              >
                Case {i + 1}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Input</label>
                <textarea
                  style={{ ...s.codearea, minHeight: "60px" }}
                  value={tc.input}
                  onChange={(e) => updateVisible(i, "input", e.target.value)}
                  rows={2}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Output</label>
                <input
                  style={s.input}
                  value={tc.output}
                  onChange={(e) => updateVisible(i, "output", e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Explanation</label>
                <input
                  style={s.input}
                  value={tc.explanation || ""}
                  onChange={(e) =>
                    updateVisible(i, "explanation", e.target.value)
                  }
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

        {/* Hidden Test Cases */}
        <div style={s.card}>
          <div
            style={{
              ...s.cardTitle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Hidden Test Cases</span>
            <button style={s.btnAdd} onClick={addHidden}>
              + Add Case
            </button>
          </div>
          {hiddenTestCases.map((tc, i) => (
            <div key={i} style={s.tcCard}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6366f1",
                  marginBottom: "10px",
                }}
              >
                Case {i + 1}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={s.label}>Input</label>
                <textarea
                  style={{ ...s.codearea, minHeight: "60px" }}
                  value={tc.input}
                  onChange={(e) => updateHidden(i, "input", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label style={s.label}>Output</label>
                <input
                  style={s.input}
                  value={tc.output}
                  onChange={(e) => updateHidden(i, "output", e.target.value)}
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

        {/* Code Templates */}
        <div style={s.card}>
          <div style={s.cardTitle}>Code Templates & Reference Solutions</div>
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
          <div>
            <label style={s.label}>
              Reference Solution — {LANG_LABELS[activeLang]}{" "}
              <span style={{ color: "#f87171" }}>*</span>
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
              rows={7}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={submitLoading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            cursor: submitLoading ? "not-allowed" : "pointer",
            opacity: submitLoading ? 0.7 : 1,
            marginTop: "8px",
          }}
        >
          {submitLoading ? "Updating…" : "Update Problem"}
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
