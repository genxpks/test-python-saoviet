"use client";

import RoadmapStepCard from "./RoadmapStepCard";

interface RoadmapGridContainerProps {
  steps: any[];
}

export default function RoadmapGridContainer({ steps }: RoadmapGridContainerProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.2rem" }}>
      {steps.map((s, idx) => (
        <RoadmapStepCard key={idx} item={s} />
      ))}
    </div>
  );
}
