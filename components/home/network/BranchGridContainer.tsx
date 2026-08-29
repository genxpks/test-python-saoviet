"use client";

import BranchCard3D from "./BranchCard3D";

interface BranchGridContainerProps {
  branches: any[];
  activeBranchCode: string;
  onSelectBranch: (branch: any) => void;
}

export default function BranchGridContainer({
  branches,
  activeBranchCode,
  onSelectBranch
}: BranchGridContainerProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.2rem" }}>
      {branches.map((b) => (
        <BranchCard3D
          key={b.code}
          branch={b}
          isSelected={activeBranchCode === b.code}
          onSelect={() => onSelectBranch(b)}
        />
      ))}
    </div>
  );
}
