"use client";

export default function HeroTitleDisplay() {
  return (
    <h1 style={{
      fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
      fontWeight: 900,
      lineHeight: 1.15,
      marginBottom: "1.2rem",
      letterSpacing: "-0.04em",
      color: "#0f172a"
    }}>
      Hệ Thống Đào Tạo & <br />
      <span style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 50%, #10b981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block"
      }}>
        Khảo Thí Lập Trình 3D
      </span>
    </h1>
  );
}
