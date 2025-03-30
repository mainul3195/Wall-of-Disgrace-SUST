// Types for cheaters data
export interface CheaterEvidence {
  id: string;
  title: string;
  leakedCode: string;
  details: string[];
}

export interface CheaterData {
  id: number;
  date: string;
  codeforcesId: string;
  vjudgeId: string;
  name: string;
  contest: string;
  evidence: string;
}

// Evidence details
export const evidenceDetails: CheaterEvidence[] = [
//   {
//     id: "evidence1",
//     title: "Evidence that rabbyxq cheated (Someone reported this and we verified)",
//     leakedCode: "https://codeforces.com/blog/entry/132672?#comment-1184621",
//     details: [
//       "There is a reply to the comment which highlights how to find the cheaters.",
//       "Notice rabbyxq's submission having the same useless condition:",
//       'He probably doesn\'t even know grundy, so he thought "gr" stands for "grid".',
//       "Also, has a sudden rating increase, which I believe is because of cheating.",
//       "Previously has skipped submissions.",
//     ],
//   },
//   {
//     id: "evidence2",
//     title: "Evidence for Rakib's cheating",
//     leakedCode: "https://example.com/evidence2",
//     details: [
//       "Multiple suspicious submissions found",
//       "Similar code pattern with other contestants",
//       "Unusual solving pattern detected",
//     ],
//   },
//   {
//     id: "evidence3",
//     title: "Evidence of code plagiarism in Eid Salami Contest",
//     leakedCode: "https://example.com/evidence3",
//     details: [
//       "Almost identical solution structure with minor variable name changes",
//       "Same implementation approach and algorithm choice as another participant",
//       "Found matching comment structure and formatting style",
//       "Similar submission time stamps within minutes of each other",
//     ],
//   },
//   {
//     id: "evidence4",
//     title: "Evidence of AI usage during AtCoder contest",
//     leakedCode: "https://example.com/evidence4",
//     details: [
//       "Solution contains distinct patterns consistent with AI-generated code",
//       "Implementation includes unnecessary optimizations typical of AI tools",
//       "Code structure differs significantly from contestant's previous submissions",
//       "Uses rare library functions and coding patterns not previously seen in contestant's history",
//     ],
//   },
];

// Cheaters data
export const cheatersData: CheaterData[] = [
//   {
//     id: 1,
//     date: "2025-03-29",
//     codeforcesId: "https://codeforces.com/profile/rabbyxq",
//     vjudgeId: "https://codeforces.com/profile/rabbyxq",
//     name: "Hasan",
//     contest: "https://codeforces.com/contest/2002",
//     evidence: "evidence1",
//   },
//   {
//     id: 2,
//     date: "2025-03-30",
//     codeforcesId: "rakib123",
//     vjudgeId: "rakib_vj",
//     name: "Rakib Hossain",
//     contest: "Weekly #6",
//     evidence: "evidence2",
//   },
//   {
//     id: 3,
//     date: "2025-04-12",
//     codeforcesId: "https://codeforces.com/profile/ahmadSUST",
//     vjudgeId: "ahmad22",
//     name: "Ahmad Khan",
//     contest: "Eid Salami Contest 2025",
//     evidence: "evidence3",
//   },
//   {
//     id: 4,
//     date: "2025-04-15",
//     codeforcesId: "farhan_cp",
//     vjudgeId: "farhan_cp",
//     name: "Farhan Rahman",
//     contest: "https://atcoder.jp/contests/abc345",
//     evidence: "evidence4",
//   },
];

// Helper function to get evidence by ID
export const getEvidenceById = (evidenceId: string): CheaterEvidence | undefined => {
  return evidenceDetails.find((e) => e.id === evidenceId);
};

// Stats about cheaters
export const cheaterStats = {
}; 