"use client";
import Image from "next/image";
import styles from "./homepage.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cheatersData, getEvidenceById } from "./data/cheaters";
import { useTheme } from "./contexts/ThemeContext";

// Close Icon SVG component
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export default function Home() {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [animateHeader, setAnimateHeader] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Add animation after component mounts for better UX
    setAnimateHeader(true);
  }, []);

  // Handle body scroll locking when popups are open
  useEffect(() => {
    if (isPopupVisible) {
      // Prevent scrolling on the body
      document.body.classList.add(styles.noScroll);
    } else {
      // Re-enable scrolling
      document.body.classList.remove(styles.noScroll);
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isPopupVisible]);

  // Function to close the evidence popup
  const closeEvidencePopup = () => {
    setIsPopupVisible(false);
    setSelectedEvidence(null);
  };

  return (
    <div className={styles.container}>
      {/* Glassy Evidence Popup */}
      {isPopupVisible && selectedEvidence && (
        <div className={styles.popup} onClick={closeEvidencePopup} data-theme={theme}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const evidence = getEvidenceById(selectedEvidence);
              return evidence ? (
                <>
                  <div className={styles.popupHeader}>
                    <h2>{evidence.title}</h2>
                    <button
                      className={styles.closeButton}
                      onClick={closeEvidencePopup}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <div className={styles.popupBody}>
                    <p>
                      <span className="font-bold">Leaked codes:</span>{" "}
                      <a
                        href={evidence.leakedCode}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {evidence.leakedCode}
                      </a>
                    </p>
                    {evidence.details.map((detail, index) => (
                      <p key={index}>{detail}</p>
                    ))}
                  </div>
                  <div className={styles.popupFooter}>
                    <button
                      className={styles.closeButtonBottom}
                      onClick={closeEvidencePopup}
                      aria-label="Close evidence popup"
                    >
                      <CloseIcon /> Close
                    </button>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}

      <div className={styles.upperPart}>
        <h1 className={styles.dangerHeading}>
          <span className={styles.warningIcon}>⚠️</span>
          WALL OF DISGRACE
          <span className={styles.warningIcon}>⚠️</span>
        </h1>
        <p className={styles.description}>
          The Wall of Disgrace lists members of SUST Competitive Programming
          Community who have been caught cheating in programming contests.
          Individuals listed here are <b>permanently banned</b> from
          participating in all SUST Competitive Programming activities. Their
          violations are publicly posted on this page and announced in all SUST
          CP community groups. Note that account holders are responsible for all
          actions performed with their account.
        </p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.reportButton}
            onClick={() =>
              window.open("https://forms.gle/kADikhePcnCydnfs9", "_blank")
            }
          >
            Report Cheating
          </button>
          <Link href="/policy" className={styles.policyButton}>
            Integrity Policy & Violations
          </Link>
        </div>
      </div>

      <div className={styles.lowerPart}>
        <h2 className={styles.tableHeading}>Current Cheaters List</h2>
        <div className={styles.listImageContainer}>
          <Image
            className={`${styles.listImage} ${
              animateHeader ? styles.animate : ""
            }`}
            src="/image.png"
            alt="Wall of Disgrace Banner"
            height={150}
            width={300}
            priority
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Codeforces Id</th>
                <th className={styles.th}>Vjudge Id</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Contest</th>
                <th className={styles.th}>Punishment</th>
                <th className={styles.th}>Evidence</th>
              </tr>
            </thead>
            {cheatersData.length > 0 ? (
              <tbody>
                {cheatersData.map((entry) => (
                  <tr key={entry.id} className={styles.tr}>
                    <td className={styles.td}>{entry.id}</td>
                    <td className={styles.td}>{entry.date}</td>
                    <td className={styles.td}>
                      <a
                        className={styles.link}
                        href={entry.codeforcesId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.codeforcesId.split("/").pop()}
                      </a>
                    </td>
                    <td className={styles.td}>
                      <a
                        className={styles.link}
                        href={entry.vjudgeId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.vjudgeId.split("/").pop()}
                      </a>
                    </td>
                    <td className={styles.td}>
                      <b>{entry.name}</b>
                    </td>
                    <td className={styles.td}>
                      <a
                        className={styles.link}
                        href={entry.contest}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.contest.split("/").pop()}
                      </a>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.punishment} ${entry.punishment.includes("Permanent") ? styles.permanentBan : ""}`}>
                        {entry.punishment}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <button
                        className={styles.evidenceButton}
                        onClick={() => {
                          setSelectedEvidence(entry.evidence);
                          setIsPopupVisible(true);
                        }}
                      >
                        Show Evidence
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={8} className={styles.emptyMessage}>
                    No cheaters verified till now
                  </td>
                </tr>
              </tbody>
            )}
          </table>
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
