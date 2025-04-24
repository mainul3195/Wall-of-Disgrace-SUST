"use client";
import { useState, useEffect } from "react";
import styles from "../homepage.module.css";
import { useTheme } from "../contexts/ThemeContext";

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

export default function AboutButton() {
  const [isAboutPopupVisible, setIsAboutPopupVisible] =
    useState<boolean>(false);
  const { theme } = useTheme();

  // Function to toggle the about popup
  const toggleAboutPopup = () => {
    setIsAboutPopupVisible(!isAboutPopupVisible);
  };

  // Handle body scroll locking when the about popup is open
  useEffect(() => {
    if (isAboutPopupVisible) {
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
  }, [isAboutPopupVisible]);

  return (
    <>
      {/* About Icon */}
      <div className={styles.aboutIconContainer}>
        <button
          className={styles.aboutIcon}
          onClick={toggleAboutPopup}
          aria-label="About"
        >
          i
        </button>
      </div>

      {/* About Popup */}
      {isAboutPopupVisible && (
        <div
          className={styles.popup}
          onClick={() => setIsAboutPopupVisible(false)}
          data-theme={theme}
        >
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.popupHeader}>
              <h2>About</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsAboutPopupVisible(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.popupBody}>
              <p>
                Skeletoned by{" "}
                <a
                  href="https://www.facebook.com/WEhEDl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Mehedi
                </a>
                , further designed and developed by{" "}
                <a
                  href="https://mainul3195.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Mainul
                </a>
                .
              </p>
            </div>
            <div className={styles.popupFooter}>
              <button
                className={styles.closeButtonBottom}
                onClick={() => setIsAboutPopupVisible(false)}
                aria-label="Close about popup"
              >
                <CloseIcon /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
