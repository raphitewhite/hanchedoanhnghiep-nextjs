"use client";

import Image from "next/image";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-header">
          <h2 className="success-modal-title">Appeal request has been submitted</h2>
          <button className="success-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="success-illustration">
          <div className="success-image-wrapper">
            <Image src="/image.png" alt="Meta security illustration" fill className="success-image" />
          </div>
        </div>
        <div className="success-modal-body">
          <p className="success-text">
            Your appeal request has been submitted and added to our review queue. Our team will review your case within 24-48 hours. If you do not receive a response, please check your email or submit additional information to assist with the review process.
          </p>
          <p className="success-support">From the Meta Policy Review Team.</p>
          <button type="button" className="success-return-btn" onClick={() => window.location.href = "https://www.facebook.com"}>Return to Facebook</button>
        </div>
        <div className="success-modal-footer">
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

        .success-modal {
          background-color: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .success-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #e4e6eb;
        }

        .success-modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1c1e21;
        }

        .success-modal-close {
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

        .success-modal-close:hover {
          background-color: #f0f2f5;
        }

        .success-illustration {
          padding: 24px 24px 0 24px;
        }

        .success-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #f4f0ff, #eff6ff);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .success-image {
          object-fit: cover;
        }

        .success-modal-body {
          padding: 20px;
          text-align: center;
        }

        .success-text {
          font-size: 15px;
          color: #1c1e21;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .success-support {
          font-size: 14px;
          color: #65676b;
          margin-bottom: 24px;
        }

        .success-return-btn {
          width: 100%;
          padding: 12px;
          background-color: #1877f2;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .success-return-btn:hover {
          background-color: #166fe5;
        }

        .success-modal-footer {
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e4e6eb;
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

