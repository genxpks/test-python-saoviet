"use client";

import TechCard3D from "./TechCard3D";

interface TechGridContainerProps {
  stack: any[];
}

export default function TechGridContainer({ stack }: TechGridContainerProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
      {stack.map((item, idx) => (
        <TechCard3D key={idx} item={item} />
      ))}
    </div>
  );
}
