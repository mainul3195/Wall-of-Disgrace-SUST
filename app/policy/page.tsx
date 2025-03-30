"use client";
import styles from "../homepage.module.css";
import Link from "next/link";

export default function PolicyPage() {
  const policyContent = {
    title: "SUST Competitive Programming Integrity Policy",
    sections: [
      "The SUST Competitive Programming Community maintains a zero-tolerance policy for cheating. Any member found violating our integrity standards will face immediate consequences including permanent ban from all SUST CP activities. When a report is verified, the violator's name and details will be publicly posted on this page and announced in all SUST CP community groups.",
      {
        text: "If you have evidence that someone with the SUST university tag has cheated in any programming contest, please report it using our form:",
        link: {
          text: "Report Cheater",
          url: "https://forms.gle/17QkcfyWmm4a9YPy5",
        },
        suffix:
          ". All reports are thoroughly investigated by our disciplinary committee, and your identity will remain confidential.",
      },
      {
        text: "If you believe your name has been wrongfully included in the Wall of Disgrace, you may submit an appeal via this form:",
        link: {
          text: "Appeal Form",
          url: "#",
        },
        suffix:
          ". Appeals must include clear evidence disproving the allegations.",
      },
    ],
    whatIsConsidered: {
      title: "What Constitutes Cheating?",
      points: [
        "Copying code from other contestants or online resources during contests where external help is prohibited.",
        "Using AI tools (ChatGPT, Copilot, etc.) during contests.",
        "Submitting similar code with only superficial changes (e.g., renamed variables, changed formatting) to evade plagiarism detection.",
        "Having submissions skipped by Codeforces' automatic plagiarism detection system.",
        "Sharing your solutions with others during ongoing contests.",
        "Using unauthorized resources during team formation contests, team practice sessions, or other SUST CP events.",
        "Collaborating with others during individual competitions (Codeforces, CodeChef, AtCoder, etc.) when representing SUST.",
        "Accessing or using pre-written code beyond what is allowed by contest rules.",
        "Creating multiple accounts to participate in the same contest.",
        "Sharing your account credentials with others. The account holder will be held responsible for any violations committed using their account.",
        "Deliberately circumventing contest rules or integrity measures.",
      ],
      conclusion:
        "Fair competition is fundamental to the growth of all members. If you are unsure whether a particular action constitutes cheating, assume it does and refrain from it. Maintaining personal integrity is more valuable than any contest result.",
      warning:
        "You bear the full responsibility for all actions performed using your account, even if you claim someone else accessed it. Sharing your credentials is never permitted under any circumstances.",
    },
    consequences: {
      title: "Consequences of Cheating",
      points: [
        "Permanent ban from all SUST competitive programming events, practices, and community activities.",
        "Public listing on this Wall of Disgrace page with full details of the violation.",
        "Announcement of the violation in all SUST CP community groups and channels.",
        "Restriction from representing SUST in any future programming competitions.",
        "Forfeiture of any positions, roles, or responsibilities within the SUST CP community.",
        "No opportunity for reinstatement, regardless of appeals or apologies.",
        "Potential notification to relevant university authorities about academic integrity violations.",
        "Documentation of the incident that may affect recommendations or endorsements for professional opportunities.",
        "Damage to personal and professional reputation within the competitive programming community.",
      ],
      conclusion:
        "These consequences are non-negotiable and will be enforced without exception. These rules apply equally to all members regardless of experience level or ranking. The SUST competitive programming community takes integrity violations with the utmost seriousness. There is NO apology system and NO path to reinstatement once a cheating incident has been verified. The decision to cheat carries permanent consequences that will follow throughout your academic and professional career.",
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.policyPage}>
        <div className={styles.policyHeader}>
          <h1 className={styles.policyTitle}>{policyContent.title}</h1>
          <Link href="/" className={styles.returnHome}>
            Return to Wall of Disgrace
          </Link>
        </div>

        <div className={styles.policyContent}>
          {policyContent.sections.map((section, index) => (
            <div key={index} className={styles.policySection}>
              {typeof section === "string" ? (
                <p>{section}</p>
              ) : (
                <p>
                  {section.text}{" "}
                  <a
                    href={section.link.url}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {section.link.text}
                  </a>
                  {section.suffix}
                </p>
              )}
            </div>
          ))}

          <div className={styles.policySection}>
            <h2 className={styles.policySubtitle}>
              {policyContent.consequences.title}
            </h2>
            <ul className={styles.policyList}>
              {policyContent.consequences.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p>{policyContent.consequences.conclusion}</p>
            <div className={styles.warningBox}>
              <h4 className={styles.warningTitle}>⚠️ IMPORTANT NOTICE</h4>
              <p className={styles.warningText}>
                {policyContent.whatIsConsidered.warning}
              </p>
            </div>
          </div>

          <div className={styles.policySection}>
            <h2 className={styles.policySubtitle}>
              {policyContent.whatIsConsidered.title}
            </h2>
            <ul className={styles.policyList}>
              {policyContent.whatIsConsidered.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p>{policyContent.whatIsConsidered.conclusion}</p>

          </div>
        </div>

        <div className={styles.policyFooter}>
          <Link href="/" className={styles.returnHomeButton}>
            Return to Wall of Disgrace
          </Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} SUST Competitive Programming Community.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}
