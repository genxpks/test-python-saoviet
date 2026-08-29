"use client";

import TiltCard3D from "../TiltCard3D";
import RoadmapStepNumberBadge from "./RoadmapStepNumberBadge";
import RoadmapStepIconBox from "./RoadmapStepIconBox";
import RoadmapStepContent from "./RoadmapStepContent";

interface RoadmapStepCardProps {
  item: {
    step: string;
    title: string;
    desc: string;
    icon: any;
    color: string;
  };
}

export default function RoadmapStepCard({ item }: RoadmapStepCardProps) {
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <RoadmapStepIconBox icon={item.icon} color={item.color} />
            <RoadmapStepNumberBadge step={item.step} />
          </div>

          <RoadmapStepContent title={item.title} desc={item.desc} />
        </div>
      </div>
    </TiltCard3D>
  );
}
