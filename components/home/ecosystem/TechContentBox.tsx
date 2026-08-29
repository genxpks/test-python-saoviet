"use client";

interface TechContentBoxProps {
  title: string;
  desc: string;
}

export default function TechContentBox({ title, desc }: TechContentBoxProps) {
  return (
    <>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.45rem", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.55" }}>
        {desc}
      </p>
    </>
  );
}
