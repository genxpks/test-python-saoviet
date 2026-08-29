"use client";

export default function HeroTitleDisplay() {
  return (
    <h1 style={{
      fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
      fontWeight: 900,
      lineHeight: 1.1,
      marginBottom: "1.2rem",
      letterSpacing: "-0.05em",
      color: "#f1f5f9"
    }}>
      Hệ Thống Đào Tạo &{" "}
      <span style={{
        background: "linear-gradient(135deg, #00f5c8 0%, #3b82f6 55%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        filter: "drop-shadow(0 0 30px rgba(0,245,200,0.4))"
      }}>
        Khảo Thí Lập Trình 3D
      </span>
    </h1>
  );
}
