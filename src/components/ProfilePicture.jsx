import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { updateProfilePicture } from "../authSlice";


export default function ProfilePicture({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);

      // Step 1 — Signature lo
      const { data: sigData } = await axiosClient.get(
        "/user/profile-pic-signature"
      );

      // Step 2 — Directly Cloudinary pe upload karo
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("public_id", sigData.public_id);

      const cloudRes = await fetch(sigData.upload_url, {
        method: "POST",
        body: formData,
      });
      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

      // Step 3 — URL backend mein save karo
      const { data } = await axiosClient.post("/user/save-profile-picture", {
        secureUrl: cloudData.secure_url,
      });

      dispatch(updateProfilePicture(data.profilePicture));
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#0b1220",
        border: "1px solid #162135",
        borderRadius: "20px",
        padding: "32px",
        width: "340px",
        zIndex: 101,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Shimmer */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%",
          height: "1px",
          background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)",
        }} />

        {/* Title */}
        <h2 style={{
          fontSize: "16px", fontWeight: 800,
          color: "#f1f5f9", marginBottom: "6px",
        }}>
          Update Profile Photo
        </h2>
        <p style={{ fontSize: "12px", color: "#2d3f5c", marginBottom: "24px" }}>
          JPG, PNG — max 2MB
        </p>

        {/* Avatar Preview */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div
            onClick={() => fileRef.current.click()}
            style={{
              width: "100px", height: "100px",
              borderRadius: "50%",
              border: "2px dashed #6366f1",
              overflow: "hidden",
              cursor: "pointer",
              background: "#060b12",
              position: "relative",
            }}
          >
            {preview || user?.profilePicture ? (
              <img
                src={preview || user.profilePicture}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: "32px", fontWeight: 800, color: "#fff",
              }}>
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Hover overlay */}
            <div
              style={{
                position: "absolute", inset: 0,
                background: "rgba(99,102,241,0.35)",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                opacity: 0, transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              <span style={{ fontSize: "11px", color: "#fff", fontWeight: 700 }}>
                Change
              </span>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Choose button */}
        <button
          onClick={() => fileRef.current.click()}
          style={{
            width: "100%", height: "38px",
            background: "transparent",
            border: "1px solid #162135",
            borderRadius: "8px",
            color: "#94a3b8",
            fontSize: "13px", fontWeight: 600,
            cursor: "pointer", marginBottom: "12px",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "#6366f1"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#162135"}
        >
          Choose Image
        </button>

        {/* Error */}
        {error && (
          <p style={{
            color: "#f87171", fontSize: "12px",
            marginBottom: "12px", textAlign: "center",
          }}>
            {error}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: "40px",
              background: "transparent",
              border: "1px solid #162135",
              borderRadius: "9px",
              color: "#94a3b8",
              fontSize: "13px", fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              flex: 1, height: "40px",
              background: !file || loading
                ? "#1a1a3e"
                : "linear-gradient(135deg,#6366f1,#7c3aed)",
              border: "none",
              borderRadius: "9px",
              color: "#fff",
              fontSize: "13px", fontWeight: 700,
              cursor: !file || loading ? "not-allowed" : "pointer",
              boxShadow: !file || loading
                ? "none"
                : "0 4px 14px rgba(99,102,241,0.3)",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Uploading…" : "Save Photo"}
          </button>
        </div>
      </div>
    </>
  );
}