import Link from "next/link";

interface PolicyCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export default function PolicyCard({ icon, title, description, href }: PolicyCardProps) {
  return (
    <div className="policy-card">
      <div className="policy-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={href} className="policy-link">
        Learn more →
      </Link>
      <style jsx>{`
        .policy-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .policy-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .policy-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .policy-card h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1c1e21;
          margin-bottom: 12px;
        }

        .policy-card p {
          font-size: 15px;
          color: #65676b;
          margin-bottom: 20px;
        }

        .policy-link {
          color: #1877f2;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .policy-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

