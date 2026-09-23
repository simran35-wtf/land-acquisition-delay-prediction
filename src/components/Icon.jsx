const paths = {
  Dashboard: "M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z",
  "Active Projects": "M4 6h16M4 12h16M4 18h10",
  "Add New Project": "M12 5v14M5 12h14",
  "Project History": "M12 8v5l3 2M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4",
  Alerts: "M12 9v4m0 4h.01M10.3 3.9 2.6 17a1.8 1.8 0 0 0 1.6 2.7h15.6a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0z",
  Reports: "M6 20V10M12 20V4M18 20v-7",
  "Help & Support": "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01",
};

export default function Icon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
