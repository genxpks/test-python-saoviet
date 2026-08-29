"use client";

interface SubjectTrackMetaTagProps {
  code: string;
  color: string;
}

export default function SubjectTrackMetaTag({ code, color }: SubjectTrackMetaTagProps) {
  return (
    <span style={{
      fontSize: "0.72rem",
      fontWeight: 800,
      color: color,
      background: "rgba(0, 0, 0, 0.04)",
      padding: "1px 6px",
      borderRadius: "4px"
    }}>
      {code}
    </span>
  );
}
