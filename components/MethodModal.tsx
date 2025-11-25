"use client";

import { useState } from "react";

interface MethodModalProps {
  onClose: () => void;
  onContinue: (method: "app" | "sms" | "email" | "whatsapp") => void;
  contactInfo: {
    phoneNumber: string;
    email: string;
  };
}

const maskPhone = (phone: string) => {
  if (!phone) return "your phone number";
  const trimmed = phone.trim();
  if (trimmed.length <= 4) return trimmed;
  const prefix = trimmed.slice(0, 3);
  const suffix = trimmed.slice(-2);
  return `${prefix} ***** ${suffix}`;
};

const maskEmail = (email: string) => {
  if (!email) return "your email";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local[0] || "";
  const hidden = local.length > 1 ? "***" : "";
  return `${visible}${hidden}@${domain}`;
};

export default function MethodModal({ onClose, onContinue, contactInfo }: MethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"app" | "sms" | "email" | "whatsapp">("app");

  const methods = [
    { id: "app", title: "Authenticator app", subtitle: "Authenticator app" },
    { id: "sms", title: "SMS", subtitle: `We will send a code to the number ${maskPhone(contactInfo.phoneNumber)}` },
    { id: "email", title: "E-mail", subtitle: `We will send a code to ${maskEmail(contactInfo.email)}` },
    { id: "whatsapp", title: "WhatsApp", subtitle: `We will send a code to the number ${maskPhone(contactInfo.phoneNumber)}` },
  ] as const;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="method-modal" onClick={(e) => e.stopPropagation()}>
        <div className="method-header">
          <h2>Choose a way to confirm that it&#39;s you</h2>
        </div>

        <div className="method-list">
          {methods.map((method) => (
            <label key={method.id} className={`method-item ${selectedMethod === method.id ? "active" : ""}`}>
              <input
                type="radio"
                name="verifyMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
              />
              <div>
                <div className="method-title">{method.title}</div>
                <div className="method-subtitle">{method.subtitle}</div>
              </div>
            </label>
          ))}
        </div>

        <button className="method-continue" onClick={() => onContinue(selectedMethod)}>
          Continue
        </button>

        <div className="method-footer">
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

        .method-modal {
          background-color: #ffffff;
          border-radius: 16px;
          width: 90%;
          max-width: 420px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .method-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1d1f33;
          text-align: center;
        }

        .method-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .method-item {
          display: flex;
          gap: 12px;
          padding: 14px;
          border: 1px solid #e3e6f0;
          border-radius: 14px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .method-item.active {
          border-color: #1877f2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .method-item input {
          margin-top: 4px;
        }

        .method-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2240;
        }

        .method-subtitle {
          font-size: 13px;
          color: #7c7f9b;
        }

        .method-continue {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background-color: #1877f2;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .method-continue:hover {
          background-color: #166fe5;
        }

        .method-footer {
          margin-top: 18px;
          display: flex;
          justify-content: center;
        }

        .meta-logo {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #9294b5;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

