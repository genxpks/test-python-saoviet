"use client";

export default function HeroTitleDisplay() {
  return (
    <h1 style={{
      fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
      fontWeight: 900,
      lineHeight: 1.15,
      marginBottom: "1.1rem",
      letterSpacing: "-0.04em",
      color: "#0f172a"
    }}>
      Hệ Thống Đào Tạo & <br />
      <span style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #0284c7 40%, #059669 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block"
      }}>
        Khảo Thí Lập Trình 3D
      </span>
    </h1>
  );
}
