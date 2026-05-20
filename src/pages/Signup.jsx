import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain atleast 3 characters"),
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password should contain atleast 8 characters"),
});

function CodeSageLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "11px",
        justifyContent: "center",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path
          d="M20 2L37 20L20 38L3 20Z"
          fill="url(#g1)"
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
          stroke="url(#g1)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Code
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sage
          </span>
        </div>
        <div
          style={{
            fontSize: "9px",
            color: "#475569",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginTop: "3px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          AI · DSA · Practice
        </div>
      </div>
    </div>
  );
}

function InputField({ label, error, children }) {
  return (
    <div style={{ marginBottom: "13px" }}>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "#94a3b8",
          marginBottom: "8px",
          letterSpacing: "0.02em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{
            color: "#f87171",
            fontSize: "11.5px",
            marginTop: "5px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const submittedData = (data) => dispatch(registerUser(data));

  const inputStyle = (hasError) => ({
    width: "100%",
    height: "40px",
    padding: "0 12px",
    background: "#060b12",
    border: `1px solid ${hasError ? "#f87171" : "#162135"}`,
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "13px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "350px",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "390px",
          background: "#0b1220",
          border: "1px solid #131f33",
          borderRadius: "20px",
          padding: "30px 28px 26px",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            right: "25%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.45), transparent)",
          }}
        />

        {/* Logo */}
        <CodeSageLogo />

        {/* Title — centered, below logo, above fields */}
        <div style={{ textAlign: "center", margin: "20px 0 22px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#f1f5f9",
              margin: 0,
              letterSpacing: "-0.025em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              fontSize: "12.5px",
              color: "#475569",
              marginTop: "5px",
              lineHeight: 1.5,
            }}
          >
            Practice DSA problems with your personal AI mentor
          </p>
        </div>

        <form onSubmit={handleSubmit(submittedData)}>
          <InputField label="Username" error={errors.firstName?.message}>
            <input
              type="text"
              placeholder="John Doe"
              {...register("firstName")}
              style={inputStyle(!!errors.firstName)}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.firstName
                  ? "#f87171"
                  : "#162135";
                e.target.style.boxShadow = "none";
              }}
            />
          </InputField>

          <InputField label="Email Address" error={errors.emailId?.message}>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("emailId")}
              style={inputStyle(!!errors.emailId)}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.emailId
                  ? "#f87171"
                  : "#162135";
                e.target.style.boxShadow = "none";
              }}
            />
          </InputField>

          <InputField label="Password" error={errors.password?.message}>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                {...register("password")}
                style={{
                  ...inputStyle(!!errors.password),
                  paddingRight: "40px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password
                    ? "#f87171"
                    : "#162135";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "11px",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2d3f5c",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#2d3f5c")}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </InputField>

          {error && (
            <div
              style={{
                background: "#150808",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: "7px",
                padding: "8px 11px",
                color: "#f87171",
                fontSize: "12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <svg
                width="12"
                height="12"
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
              {error?.includes("400") ||
              error?.includes("already") ||
              error?.includes("exists")
                ? "This email is already registered. Please sign in."
                : error?.includes("Network") || error?.includes("network")
                  ? "Network error. Please check your connection."
                  : "Something went wrong. Please try again."}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "41px",
              background: loading
                ? "#1a1a3e"
                : "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
              border: "none",
              borderRadius: "9px",
              color: "#fff",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              marginTop: "8px",
              transition: "opacity 0.15s, transform 0.1s",
              boxShadow: loading ? "none" : "0 4px 18px rgba(99,102,241,0.28)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = "0.87";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "16px 0 14px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#131f33" }} />
            <span
              style={{
                fontSize: "11px",
                color: "#1e2d45",
                letterSpacing: "0.06em",
              }}
            >
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "#131f33" }} />
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "12.5px",
              color: "#2d3f5c",
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#818cf8",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
              onMouseLeave={(e) => (e.target.style.color = "#818cf8")}
            >
              Sign In
            </a>
          </p>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #1e2d45; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 40px #060b12 inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}

export default Signup;
