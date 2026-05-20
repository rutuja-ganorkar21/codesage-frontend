

import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../utils/axiosClient";
import { Upload, ArrowLeft, CheckCircle, Video, Loader } from "lucide-react";

function AdminUpload() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVedio, setUploadedVedio] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch("vedioFile")?.[0];

  // ── Format helpers ────────────────────────────────────────────────────────
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Upload handler ────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    const file = data.vedioFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1 — get signature from backend
      const signatureResponse = await axiosClient.get(
        `/video/create/${problemId}`,
      );
      const {
        signature,
        timestamp,
        public_Id,
        apiKey,
        cloud_name,
        upload_url,
      } = signatureResponse.data;

      

      // Step 2 — FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);
      formData.append("public_id", public_id);


      // Step 3 — Upload to Cloudinary
      const cloudinaryResponse = await axios.post(upload_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = cloudinaryResponse.data;

      // Step 4 — Save metadata to backend
      const metadataResponse = await axiosClient.post("/video/save", {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryUrl: cloudinaryResult.url,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVedio(metadataResponse.data.vedioSolution);
      reset();
    } catch (err) {
      console.error("Upload error:", err);
      setError("root", {
        type: "manual",
        message:
          err.response?.data?.error || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
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
          onClick={() => navigate("/admin/video")}
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

      {/* Body */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0f172a",
              border: "1px solid #6366f133",
              borderRadius: "999px",
              padding: "5px 16px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#a5b4fc",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            <Video size={12} /> Upload Solution
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
              marginBottom: "6px",
            }}
          >
            Upload Video
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Upload a solution video for this problem. Max size: 100MB.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* File Input */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  marginBottom: "10px",
                }}
              >
                Choose Video File
              </label>
              <input
                type="file"
                accept="video/*"
                disabled={uploading}
                {...register("vedioFile", {
                  required: "Please select a video file",
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0])
                        return "Please select a video file";
                      return (
                        files[0].type.startsWith("video/") ||
                        "Please select a valid video file"
                      );
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const maxSize = 100 * 1024 * 1024; // 100MB
                      return (
                        files[0].size <= maxSize ||
                        "File size must be less than 100MB"
                      );
                    },
                  },
                })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#0d1117",
                  border: `1px solid ${errors.vedioFile ? "#f87171" : "#1e293b"}`,
                  borderRadius: "9px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  cursor: "pointer",
                  outline: "none",
                }}
              />
              {errors.vedioFile && (
                <div
                  style={{
                    color: "#f87171",
                    fontSize: "12px",
                    marginTop: "6px",
                  }}
                >
                  {errors.vedioFile.message?.toString() || "Invalid file"}
                </div>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div
                style={{
                  background: "#0d1117",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#f1f5f9",
                    marginBottom: "4px",
                  }}
                >
                  Selected File
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {selectedFile.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  Size: {formatFileSize(selectedFile.size)}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "8px",
                  }}
                >
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div
                  style={{
                    background: "#1e293b",
                    borderRadius: "999px",
                    height: "6px",
                  }}
                >
                  <div
                    style={{
                      background: "#6366f1",
                      borderRadius: "999px",
                      height: "6px",
                      width: `${uploadProgress}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Root Error */}
            {errors.root && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#3a0a0a",
                  border: "1px solid #f8717155",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "20px",
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
                <span style={{ fontSize: "13px", color: "#f87171" }}>
                  {typeof errors.root?.message === "string"
                    ? errors.root.message
                    : "Upload failed. Please try again."}
                </span>
              </div>
            )}

            {/* Success Message */}
            {uploadedVedio && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  background: "#0a3a2e",
                  border: "1px solid #34d39933",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                }}
              >
                <CheckCircle
                  size={18}
                  color="#34d399"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#34d399",
                      marginBottom: "4px",
                    }}
                  >
                    Upload Successful!
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Duration: {formatDuration(uploadedVedio.duration)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    Uploaded:{" "}
                    {new Date(uploadedVedio.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "9px",
                border: "none",
                background: uploading ? "#312e81" : "#6366f1",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: uploading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!uploading) e.currentTarget.style.background = "#4338ca";
              }}
              onMouseLeave={(e) => {
                if (!uploading) e.currentTarget.style.background = "#6366f1";
              }}
            >
              {uploading ? (
                <>
                  <Loader
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload size={15} /> Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default AdminUpload;
