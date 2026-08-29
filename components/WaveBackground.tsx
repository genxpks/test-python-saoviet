"use client";

export default function WaveBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}
      aria-hidden="true"
    >
      {/* Ambient radial teal glows top */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "15%",
        width: "55vw",
        height: "55vh",
        background: "radial-gradient(ellipse, rgba(64,180,220,0.055) 0%, transparent 65%)",
        filter: "blur(40px)"
      }} />
      <div style={{
        position: "absolute",
        top: "5%",
        right: "5%",
        width: "40vw",
        height: "40vh",
        background: "radial-gradient(ellipse, rgba(0,245,200,0.04) 0%, transparent 65%)",
        filter: "blur(50px)"
      }} />

      {/* Wave layer 1 — slowest, largest, deepest */}
      <svg
        className="wave wave-1"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: "38vh",
          minHeight: 220
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgba(64,160,210,0.065)"
          d="M0,210 C200,150 380,280 580,230 C780,180 980,120 1180,170 C1320,205 1400,240 1440,250 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Wave layer 2 — medium speed */}
      <svg
        className="wave wave-2"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: "32vh",
          minHeight: 180
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgba(40,140,200,0.05)"
          d="M0,240 C240,195 460,285 700,255 C900,228 1100,185 1300,210 C1390,222 1430,245 1440,260 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Wave layer 3 — fastest, most visible */}
      <svg
        className="wave wave-3"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: "26vh",
          minHeight: 140
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgba(0,220,180,0.045)"
          d="M0,270 C300,240 600,290 900,265 C1100,248 1280,255 1440,270 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Wave layer 4 — teal accent */}
      <svg
        className="wave wave-4"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: "20vh",
          minHeight: 110
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgba(0,245,200,0.038)"
          d="M0,285 C200,268 440,295 680,280 C900,267 1150,275 1440,285 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Wave layer 5 — subtle top-page mid-tone */}
      <svg
        className="wave wave-5"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10%",
          width: "120%",
          height: "14vh",
          minHeight: 70
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgba(80,175,225,0.05)"
          d="M0,295 C360,282 720,305 1080,292 C1260,286 1380,292 1440,298 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Subtle mid-page horizontal glows for depth */}
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent 5%, rgba(64,180,220,0.12) 30%, rgba(0,245,200,0.09) 50%, rgba(64,180,220,0.12) 70%, transparent 95%)",
        filter: "blur(2px)"
      }} />
      <div style={{
        position: "absolute",
        bottom: "8%",
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent 10%, rgba(0,245,200,0.08) 40%, rgba(64,180,220,0.06) 60%, transparent 90%)",
        filter: "blur(1px)"
      }} />
    </div>
  );
}
