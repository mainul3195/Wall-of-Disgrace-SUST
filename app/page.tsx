"use client"
import Image from "next/image";
import styles from "./homepage.module.css";
import { useState } from "react";
export default function Home() {
    const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [isApologyPopupVisible, setIsApologyPopupVisible] = useState<boolean>(false);

    const evidenceDetails = [
        {
            id: "evidence1",
            title: "Evidence that rabbyxq cheated (Someone reported this and we verified)",
            leakedCode: "https://codeforces.com/blog/entry/132672?#comment-1184621",
            details: [
                "There is a reply to the comment which highlights how to find the cheaters.",
                "Notice rabbyxq's submission having the same useless condition:",
                "He probably doesn't even know grundy, so he thought \"gr\" stands for \"grid\".",
                "Also, has a sudden rating increase, which I believe is because of cheating.",
                "Previously has skipped submissions."
            ]
        },
        {
            id: "evidence2",
            title: "Evidence for Rakib's cheating",
            leakedCode: "https://example.com/evidence2",
            details: [
                "Multiple suspicious submissions found",
                "Similar code pattern with other contestants",
                "Unusual solving pattern detected"
            ]
        }
    ];

    const getEvidenceById = (evidenceUrl: string) => {
        return evidenceDetails.find(e => e.id === evidenceUrl.split('/').pop());
    };

    const contestData = [
        {
            id: 1,
            date: "2025-03-29",
            codeforcesId: "https://codeforces.com/profile/rabbyxq",
            vjudgeId: "https://codeforces.com/profile/rabbyxq",
            name: "Hasan",
            contest: "https://codeforces.com/contest/2002",
            evidence: "evidence1",
        },
        {
            id: 2,
            date: "2025-03-30",
            codeforcesId: "rakib123",
            vjudgeId: "rakib_vj",
            name: "Rakib Hossain",
            contest: "Weekly #6",
            evidence: "evidence2",
        },
        // Add more entries...
    ];

    const apologyContent = {
        title: "Cheating Details",
        sections: [
            "We have a strong Cheating Detection Committee (CDC) with multiple high-rated members who verify the proofs before adding someone to the Hall of Shame.",
            {
                text: "If you have evidence that someone from Bangladesh has cheated in a Codeforces contest, please fill out this form:",
                link: {
                    text: "Report Cheater",
                    url: "https://forms.gle/17QkcfyWmm4a9YPy5"
                },
                suffix: ". We will verify your proof, and you will stay anonymous."
            },
            {
                text: "If you think your name is listed here by mistake, please fill out this form:",
                link: {
                    text: "Mistake in Hall of Shame",
                    url: "#"
                },
                suffix: "."
            },
            {
                text: "If you apologize for your mistake and promise not to cheat again, we will remove your name from the Hall of Shame after 1 day. For that please fill out this form:",
                link: {
                    text: "Apology Form",
                    url: "#"
                },
                suffix: ". But if you get caught again, we won't accept your apology in the future."
            }
        ],
        whatIsConsidered: {
            title: "What do we consider cheating?",
            points: [
                "Your code is the same as someone else's code. Maybe you have used a different style or variable naming but the code is the same.",
                "All of your solutions got skipped after the contest, meaning Codeforces detected plagiarism. That means your code is similar to someone else's code. To be more cautious we will add it only when your all solutions get automatically skipped in at least 3 different contests or if we can manually verify the plagiarism in at least one of the contests.",
                "You have shared your code with your friends."
            ],
            conclusion: "So just don't cheat. It's not worth it. You will lose your reputation and respect in the community. During the contest, do not share your code with anyone or copy someone else's code. Try to solve the problems on your own."
        }
    };

    return (
        <div className={styles.container}>
            {isPopupVisible && selectedEvidence && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        {(() => {
                            const evidence = getEvidenceById(selectedEvidence);
                            return evidence ? (
                                <>
                                    <div className={styles.popupHeader}>
                                        <h2>{evidence.title}</h2>
                                        <button 
                                            className={styles.closeButton}
                                            onClick={() => setIsPopupVisible(false)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className={styles.popupBody}>
                                        <p>Leaked codes: <a href={evidence.leakedCode} target="_blank" rel="noopener noreferrer">{evidence.leakedCode}</a></p>
                                        {evidence.details.map((detail, index) => (
                                            <p key={index}>{detail}</p>
                                        ))}
                                    </div>
                                </>
                            ) : null
                        })()}
                    </div>
                </div>
            )}

            {isApologyPopupVisible && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <div className={styles.popupHeader}>
                            <h2>{apologyContent.title}</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setIsApologyPopupVisible(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.popupBody}>
                            {apologyContent.sections.map((section, index) => (
                                <p key={index}>
                                    {typeof section === 'string' ? (
                                        section
                                    ) : (
                                        <>
                                            {section.text}{' '}
                                            <a href={section.link.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                                                {section.link.text}
                                            </a>
                                            {section.suffix}
                                        </>
                                    )}
                                </p>
                            ))}
                            
                            <h3>{apologyContent.whatIsConsidered.title}</h3>
                            <ul>
                                {apologyContent.whatIsConsidered.points.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                            <p>{apologyContent.whatIsConsidered.conclusion}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.upperPart}>
                <Image
                    className={styles.image}
                    src="/image.png"
                    alt=""
                    height={200}
                    width={400}
                />
                <p className={styles.heading}>Cheaters List From SUST</p>
                <p className={styles.description}>
                    The Hall of Shame is a place where we list the users who have been
                    caught cheating in Codeforces contests (June 2024 onwards)
                </p>
                <p className={styles.description}>
                    If you have evidence that someone from Bangladesh has cheated in a
                    Codeforces contest, please fill out this form: <a className={styles.link} href="https://forms.gle/17QkcfyWmm4a9YPy5" target="_blank" rel="noopener noreferrer">Report Cheater</a>.
                </p>
                <button 
                    className={styles.appologyButton}
                    onClick={() => setIsApologyPopupVisible(true)}
                >
                    Apology Form and Details
                </button>
            </div>

            <div className={styles.middlePart}>
                <p>Total Cheaters: 53.</p>
                <p>41 cheaters have already apologized and removed from the list.</p>
            </div>

            <div className={styles.lowerPart}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr className={styles.tr}>
                            <th className={styles.th}>#</th>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Codeforces Id</th>
                            <th className={styles.th}>Vjudge Id</th>
                            <th className={styles.th}>Name</th>
                            <th className={styles.th}>Contest</th>
                            <th className={styles.th}>Evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contestData.map((entry) => (
                            <tr key={entry.id} className={styles.tr}>
                                <td className={styles.td}>{entry.id}</td>
                                <td className={styles.td}>{entry.date}</td>
                                <td className={styles.td}>
                                    <a className={styles.link} href={entry.codeforcesId}>
                                        {entry.codeforcesId.split("/").pop()}
                                    </a>
                                </td>
                                <td className={styles.td}>
                                    <a className={styles.link} href={entry.vjudgeId}>
                                        {entry.vjudgeId.split("/").pop()}
                                    </a>
                                </td>
                                <td className={styles.td}><b>{entry.name}</b></td>
                                <td className={styles.td}>
                                    <a className={styles.link} href={entry.contest}>{entry.contest.split("/").pop()}</a>
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
                </table>
            </div>
        </div>
    );
}
