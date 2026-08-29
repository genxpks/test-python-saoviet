"use client";

import TiltCard3D from "../TiltCard3D";
import TechIconBadge from "./TechIconBadge";
import TechTagBadge from "./TechTagBadge";
import TechContentBox from "./TechContentBox";

interface TechCard3DProps {
  item: {
    title: string;
    desc: string;
    icon: any;
    color: string;
    badge: string;
  };
}

export default function TechCard3D({ item }: TechCard3DProps) {
  return (
    <TiltCard3D maxTilt={6} scale={1.015}>
      <div
        className="q-card"
        style={{
          padding: "1.6rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-subtle)",
          height: "100%",
          borderRadius: "var(--radius-md)"
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
            <TechIconBadge icon={item.icon} color={item.color} />
            <TechTagBadge badge={item.badge} color={item.color} />
          </div>

          <TechContentBox title={item.title} desc={item.desc} />
        </div>
      </div>
    </TiltCard3D>
  );
}
