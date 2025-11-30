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
        <span className={styles.eyebrow}>Meta · Business Account Restricted</span>
        <h1>We&apos;ve Restricted Your Business Account</h1>
        <p>
          We have restricted your business account due to violations of our advertising policies and Community Standards. Your account has been reviewed by our automated systems and manual review team, and we have determined that your account does not comply with Meta&apos;s advertising policies. This restriction has been applied to protect our community and maintain the integrity of our platform.
        </p>
      </header>

      <div className={styles.invitationChip}>
        <span>Business ID: <strong>7631904853721741</strong></span>
      </div>

      <div className={styles.notesCard}>
        <div className={styles.notesHead}>
          <div className={styles.notesIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#DC2626"/>
              <circle cx="10" cy="6" r="1" fill="white"/>
              <path d="M10 9V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3>What This Means</h3>
          </div>
        </div>
        <ul>
          <li>You cannot create ads or manage advertising campaigns</li>
          <li>You cannot use or share advertising features related to your business account</li>
        </ul>
      </div>

      <div className={styles.heroCallout}>
        <div className={styles.heroImage}>
          <Image src="/image.png" alt="Facebook Policy Violation Warning" width={640} height={360} priority />
        </div>
        <div className={styles.ctaCard}>
          <h3>Request Review</h3>
          <p>
            If you believe your account has been restricted in error, you can request a review. Our team will examine your account and respond within 24-48 hours.
          </p>
          <p>
            Please provide accurate information about your business to help us review your account. Incomplete or inaccurate details may delay the review process.
          </p>
          <button className={styles.ctaButton} type="button" onClick={onAppealClick}>
            Request Review
          </button>
          <p className={styles.ctaNote}>
            Account restriction applied on <span id="invitationDate"></span>. Please take action as soon as possible.
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
        Our technology helps identify businesses that may be violating our advertising policies and Community Standards. This helps us maintain a safe and trustworthy platform for everyone. <a href="#">Learn more about our policies.</a>
      </p>
    </div>
  );
}
