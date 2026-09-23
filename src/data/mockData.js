// ---------- FAKE DATA (later replace with real API calls) ----------

export const initialProjects = [
  {
    id: 1, name: "Riverdale Bypass Road", district: "Sunpur District", risk: "High", prob: 76, progress: 40,
    landArea: 1200, acquired: 680, landowners: 130, approvalStage: "Environmental Clearance", disputes: 6,
    startDate: "Jan 2024", eta: "Dec 2027",
    reasons: ["Large number of pending landowner approvals (37)", "6 active disputes across 3 villages", "Acquisition rate 18% slower than similar projects"],
    actions: ["Fast-track dispute resolution with district revenue office", "Schedule a landowner consent meeting this month", "Escalate pending environmental clearance"],
    history: [
      { m: "Jan 24", actual: 5, exp: 8 }, { m: "Jul 24", actual: 14, exp: 22 },
      { m: "Jan 25", actual: 24, exp: 38 }, { m: "Jul 25", actual: 33, exp: 55 }, { m: "Now", actual: 40, exp: 64 },
    ],
  },
  {
    id: 2, name: "Greenfield Expressway", district: "Meera District", risk: "High", prob: 68, progress: 55,
    landArea: 940, acquired: 517, landowners: 96, approvalStage: "Compensation Disbursal", disputes: 4,
    startDate: "Mar 2024", eta: "Aug 2027",
    reasons: ["Compensation disbursal delayed for 22 landowners", "4 disputes pending in civil court", "Survey revision requested by 2 villages"],
    actions: ["Release pending compensation batch", "Coordinate with legal cell on court disputes", "Re-verify survey for flagged villages"],
    history: [
      { m: "Mar 24", actual: 6, exp: 10 }, { m: "Sep 24", actual: 20, exp: 28 },
      { m: "Mar 25", actual: 36, exp: 48 }, { m: "Sep 25", actual: 48, exp: 62 }, { m: "Now", actual: 55, exp: 70 },
    ],
  },
  {
    id: 3, name: "Shivpur Ring Road", district: "Kalyan District", risk: "Medium", prob: 42, progress: 70,
    landArea: 610, acquired: 427, landowners: 58, approvalStage: "Final Notification", disputes: 2,
    startDate: "Feb 2024", eta: "Apr 2026",
    reasons: ["2 minor disputes over boundary marking", "Final notification awaiting signature"],
    actions: ["Follow up on notification signature", "Resolve boundary disputes with joint survey"],
    history: [
      { m: "Feb 24", actual: 10, exp: 12 }, { m: "Aug 24", actual: 30, exp: 32 },
      { m: "Feb 25", actual: 52, exp: 54 }, { m: "Aug 25", actual: 65, exp: 66 }, { m: "Now", actual: 70, exp: 72 },
    ],
  },
  {
    id: 4, name: "East Link Corridor", district: "Nirman District", risk: "Low", prob: 18, progress: 85,
    landArea: 380, acquired: 323, landowners: 41, approvalStage: "Handover", disputes: 0,
    startDate: "Apr 2024", eta: "Jan 2026",
    reasons: ["No active disputes", "Approvals on schedule"],
    actions: ["Continue routine monitoring", "Prepare handover documentation"],
    history: [
      { m: "Apr 24", actual: 15, exp: 15 }, { m: "Oct 24", actual: 40, exp: 38 },
      { m: "Apr 25", actual: 65, exp: 62 }, { m: "Oct 25", actual: 80, exp: 78 }, { m: "Now", actual: 85, exp: 84 },
    ],
  },
];

export const initialActivity = [
  { time: "21 Sep 2026, 05:32 PM", project: "Lucknow–Kanpur Expressway", place: "Uttar Pradesh", text: "Land record verification updated", status: "In Progress" },
  { time: "21 Sep 2026, 03:14 PM", project: "Varanasi Ring Road", place: "Uttar Pradesh", text: "New objection raised", status: "Under Review" },
  { time: "21 Sep 2026, 12:08 PM", project: "Ganga Riverfront Development", place: "Varanasi", text: "Field survey report uploaded", status: "In Progress" },
  { time: "20 Sep 2026, 06:45 PM", project: "Noida Film City", place: "Uttar Pradesh", text: "AI risk score updated (Low)", status: "On Track" },
  { time: "19 Sep 2026, 04:02 PM", project: "Riverdale Bypass Road", place: "Sunpur District", text: "Dispute filed by 2 landowners", status: "Under Review" },
  { time: "18 Sep 2026, 11:20 AM", project: "East Link Corridor", place: "Nirman District", text: "Handover documentation started", status: "On Track" },
  { time: "17 Sep 2026, 02:45 PM", project: "Shivpur Ring Road", place: "Kalyan District", text: "Boundary survey completed", status: "In Progress" },
];

export const districtStats = [
  { district: "Sunpur", high: 3, medium: 2, low: 1 },
  { district: "Meera", high: 2, medium: 3, low: 2 },
  { district: "Kalyan", high: 1, medium: 4, low: 1 },
  { district: "Nirman", high: 1, medium: 1, low: 2 },
  { district: "Varanasi", high: 1, medium: 0, low: 0 },
];

export const tone = { "In Progress": "blue", "Under Review": "amber", "On Track": "green" };
