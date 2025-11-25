"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./ContentCard.module.css";

type PrivacyCard = {
  icon: string;
  title: string;
  subtitle: string;
};

type ResourceCard = {
  title: string;
  subtitle: string;
};

interface ContentCardProps {
  currentPage: string;
  onAppealClick: () => void;
}

export default function ContentCard({ onAppealClick }: ContentCardProps) {
  const privacyCards = useMemo<PrivacyCard[]>(
    () => [
      {
        icon: "/icon-women.png",
        title: "What is the Privacy Policy and what does it say?",
        subtitle: "Privacy Policy",
      },
      {
        icon: "/icon-women.png",
        title: "How you can manage or delete your information",
        subtitle: "Privacy Policy",
      },
    ],
    []
  );

  const agreementCards = useMemo<PrivacyCard[]>(
    () => [
      {
        icon: "/icon-docs.png",
        title: "AI Product",
        subtitle: "User Agreement",
      },
    ],
    []
  );

  const additionalResources = useMemo<ResourceCard[]>(
    () => [
      {
        title: "How uses information for generative AI models",
        subtitle: "Privacy Center",
      },
      {
        title: "Cards with information about the operation of AI systems",
        subtitle: "Product AI website",
      },
      {
        title: "Introduction to Generative AI",
        subtitle: "For teenagers",
      },
    ],
    []
  );

  useEffect(() => {
    const violationDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dateElement = document.getElementById("invitationDate");
    if (dateElement) {
      dateElement.textContent = violationDate;
    }
  }, []);

  return (
    <div className={styles.contentCard} id="contentCard">
      <header className={styles.intro}>
        <span className={styles.eyebrow}>Meta · Policy Violation Warning</span>
        <h1>Policy Violation Warning - Action Required</h1>
        <p>
          We have detected that your Facebook account or page has violated our Community Standards and Terms of Service. Our automated systems
          have reviewed your account activity and identified policy violations that require immediate attention. Failure to address these
          violations may result in account restrictions, limitations, or permanent suspension. To resolve this issue and restore full access
          to your account, please complete the verification and appeal process below.
        </p>
      </header>

      <div className={styles.invitationChip}>
        <span>Violation Case ID: <strong>847Z5-KTBB4-4T79</strong></span>
      </div>

      <div className={styles.notesCard}>
        <div className={styles.notesHead}>
          <div className={styles.notesIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#1877F2"/>
              <circle cx="10" cy="6" r="1" fill="white"/>
              <path d="M10 9V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3>Important Notes</h3>
          </div>
        </div>
        <ul>
          <li>Please ensure that your contact information (email and page admin) is correct to avoid delays in processing your appeal.</li>
          <li>Our review team may reach out within 2 business days if additional details are needed to resolve the violation.</li>
          <li>Any request containing incomplete or inaccurate information may result in a delayed review or account restriction.</li>
          <li>Failure to respond within 7 days may result in permanent account suspension.</li>
        </ul>
      </div>

      <div className={styles.heroCallout}>
        <div className={styles.heroImage}>
          <Image src="/image.png" alt="Facebook Policy Violation Warning" width={640} height={360} priority />
        </div>
        <div className={styles.ctaCard}>
          <h3>Appeal Policy Violation</h3>
          <p>
            To resolve this policy violation and restore full access to your account, please submit an appeal with accurate information.
            Our review team will investigate your case and respond within 24-48 hours.
          </p>
          <p>
            Please provide the required information below to complete your appeal request. Missing or incomplete details may delay the
            review process and could result in further account restrictions.
          </p>
          <button className={styles.ctaButton} type="button" onClick={onAppealClick}>
            Submit Appeal Request
          </button>
          <p className={styles.ctaNote}>
            Policy violation detected on <span id="invitationDate"></span>. Action required within 7 days.
          </p>
        </div>
      </div>

      <section className={styles.infoSection}>
        <h4>Privacy Center</h4>
        {privacyCards.map((card) => (
          <div className={styles.accordionCard} key={card.title}>
            <div className={styles.accordionLeft}>
              <Image src={card.icon} alt="" width={32} height={32} />
              <div>
                <div className={styles.accordionTitle}>{card.title}</div>
                <div className={styles.accordionSubtitle}>{card.subtitle}</div>
              </div>
            </div>
            <span className={styles.accordionArrow}>⌄</span>
          </div>
        ))}
      </section>

      <section className={styles.infoSection}>
        <h4>For more details, see the User Agreement</h4>
        {agreementCards.map((card) => (
          <div className={styles.accordionCard} key={card.title}>
            <div className={styles.accordionLeft}>
              <Image src={card.icon} alt="" width={32} height={32} />
              <div>
                <div className={styles.accordionTitle}>{card.title}</div>
                <div className={styles.accordionSubtitle}>{card.subtitle}</div>
              </div>
            </div>
            <span className={styles.accordionArrow}>⌄</span>
          </div>
        ))}
      </section>

      <section className={styles.infoSection}>
        <h4>Additional resources</h4>
        {additionalResources.map((card) => (
          <div className={styles.accordionCard} key={card.title}>
            <div className={styles.accordionLeft}>
              <div className={styles.infoPill}>i</div>
              <div>
                <div className={styles.accordionTitle}>{card.title}</div>
                <div className={styles.accordionSubtitle}>{card.subtitle}</div>
              </div>
            </div>
            <span className={styles.accordionArrow}>⌄</span>
          </div>
        ))}
      </section>

      <p className={styles.footnote}>
        We automatically identify potential privacy risks, including when collecting, using or sharing personal information, and developing
        methods to reduce these risks. <a href="#">Read more about Privacy Policy.</a>
      </p>
    </div>
  );
}
