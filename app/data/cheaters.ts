// Types for cheaters data
export interface CheaterEvidence {
  id: string;           // Unique identifier for the evidence (e.g., "evidence1")
  title: string;        // A descriptive title for the evidence
  submissionUrl: string; // URL pointing to the cheating submission/evidence
  details: string[];    // Array of detailed points explaining the evidence
}

export interface CheaterData {
  id: number;           // Unique numeric identifier (sequential)
  date: string;         // Date when cheating was detected (YYYY-MM-DD format)
  codeforcesId: string; // Codeforces profile URL or username
  vjudgeId: string;     // VJudge profile URL or username
  name: string;         // Full name of the cheater
  contest: string;      // Contest URL or name where cheating occurred
  evidence: string;     // Reference to evidence ID (must match an ID in evidenceDetails)
  punishment: string;   // Punishment details (e.g., "Permanent Ban", "1 Year Ban")
}

// Evidence details
export const evidenceDetails: CheaterEvidence[] = [
  {
    id: "evidence_fuad",
    title: "Evidence of AI usage in Eid Salami Contest",
    submissionUrl: "https://vjudge.net/contest/705528#rank",
    details: [
      "Inconsistent coding style and indentation patterns across submissions",
      "In problem C, received a TLE verdict and then submitted a completely different, AC solution just 3 minutes later",
      "Complete code restructuring in such a short time frame (3 minutes) is virtually impossible without external assistance",
      "Analysis of submission timing, code patterns, and his own statements about cheating, strongly proves AI usage"
    ]
  }
  
  /* FORMAT EXAMPLE:
  {
    id: "evidence1",
    title: "Evidence of code plagiarism in X Contest", 
    submissionUrl: "https://example.com/submission-link",
    details: [
      "Identical code structure with another contestant",
      "Same variable names and implementation approach",
      "Multiple instances of matching code patterns",
      "Unusual submission timing after another contestant's submission"
    ]
  }
  */
];

// Cheaters data
export const cheatersData: CheaterData[] = [
  {
    id: 1,
    date: "2025-04-24", // Using today's date as the detection date
    codeforcesId: "-", // Using vjudge ID as a placeholder for CF ID
    vjudgeId: "https://vjudge.net/user/Fuad_2023831041",
    name: "Fuad",
    contest: "https://vjudge.net/contest/705528 (Eid Salami Contest)",
    evidence: "evidence_fuad",
    punishment: "1 Year Ban"
  }
  
  /* FORMAT EXAMPLE:
  {
    id: 1,
    date: "2023-04-15",
    codeforcesId: "https://codeforces.com/profile/username",
    vjudgeId: "username_vj",
    name: "Full Name",
    contest: "https://codeforces.com/contest/1234",
    evidence: "evidence1",
    punishment: "Permanent Ban"
  }
  */
];

// Helper function to get evidence by ID
export const getEvidenceById = (evidenceId: string): CheaterEvidence | undefined => {
  return evidenceDetails.find((e) => e.id === evidenceId);
};

// Stats about cheaters - can be expanded as needed
export const cheaterStats = {
  // Examples:
  // totalBanned: cheatersData.length,
  // permanentBans: cheatersData.filter(c => c.punishment.includes("Permanent")).length
}; 
