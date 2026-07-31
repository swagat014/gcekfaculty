import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [usePasswordInstead, setUsePasswordInstead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // Check if token exists, auto-redirect to dashboard if valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
    
    // Check MFA status from server
    const checkMfa = async () => {
      try {
        const res = await api.getMfaStatus();
        setMfaEnabled(res.mfaEnabled);
      } catch (err) {
        console.error("Error checking MFA status:", err);
      }
    };
    checkMfa();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.login(username, password, code);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials or verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        .login-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 10% 20%, rgba(139, 0, 0, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(234, 179, 8, 0.06) 0%, transparent 40%),
                      #fffdf9;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .login-dots {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(139, 0, 0, 0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .glass-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 0, 0, 0.1);
          box-shadow: 0 20px 40px -15px rgba(139, 0, 0, 0.08);
          border-radius: 24px;
          padding: 40px;
          z-index: 10;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          box-shadow: 0 25px 50px -12px rgba(139, 0, 0, 0.12);
          border-color: rgba(234, 179, 8, 0.4);
        }

        .brand-logo {
          text-align: center;
          margin-bottom: 28px;
        }

        .logo-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #8b0000, #eab308);
          box-shadow: 0 8px 16px rgba(139, 0, 0, 0.15);
          color: white;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .title {
          font-size: 24px;
          color: #8b0000;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 14px;
          color: #7a6e67;
          margin: 6px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #8b0000;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(139, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          color: #2b1f1a;
          transition: all 0.2s ease;
          outline: none;
        }

        .input:focus {
          border-color: #8b0000;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(139, 0, 0, 0.08);
        }

        .error-banner {
          background: rgba(139, 0, 0, 0.08);
          border: 1px solid rgba(139, 0, 0, 0.2);
          color: #8b0000;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b0000, #b30000);
          color: white;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 12px rgba(139, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(139, 0, 0, 0.2);
          background: linear-gradient(135deg, #b30000, #eab308);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(1px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-link {
          text-align: center;
          margin-top: 24px;
        }

        .back-link a {
          font-size: 14px;
          color: #8b0000;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .back-link a:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .mfa-field {
          animation: slideDown 0.3s ease-out forwards;
          opacity: 0;
          transform: translateY(-10px);
        }

        @keyframes slideDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-dots"></div>

      <div className="glass-card">
        <div className="brand-logo">
          <div className="logo-circle">GD</div>
          <h1 className="title">Faculty Portal</h1>
          <p className="subtitle">Admin Dashboard Control Center</p>
        </div>

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              required
              className="input"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {(!mfaEnabled || usePasswordInstead) && (
            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {(mfaEnabled && !usePasswordInstead) && (
            <div className="form-group mfa-field">
              <label className="label" style={{ color: "#8b0000" }}>Google Authenticator PIN</label>
              <input
                type="text"
                required
                maxLength="6"
                pattern="[0-9]*"
                inputMode="numeric"
                className="input"
                style={{ borderColor: "rgba(139, 0, 0, 0.25)" }}
                placeholder="6-digit verification code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
              />
            </div>
          )}

          {mfaEnabled && (
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => setUsePasswordInstead(!usePasswordInstead)}
                style={{ background: "none", border: "none", color: "#8b0000", fontSize: "13px", cursor: "pointer", textDecoration: "underline", padding: 0, outline: "none" }}
              >
                {usePasswordInstead ? "Use Authenticator PIN instead" : "Authenticator app not available? Login with password"}
              </button>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : null}
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
          </button>
        </form>

        <div className="back-link">
          <a href="/">← Return to Public Directory</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
