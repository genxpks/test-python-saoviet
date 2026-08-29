"use client";

import TiltCard3D from "../TiltCard3D";
import SubjectTrackIconBadge from "./SubjectTrackIconBadge";
import SubjectTrackMetaTag from "./SubjectTrackMetaTag";
import { ChevronRight } from "lucide-react";

interface SubjectTrackCardProps {
  track: any;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubjectTrackCard({ track, isSelected, onSelect }: SubjectTrackCardProps) {
  return (
    <TiltCard3D maxTilt={6} scale={1.01}>
      <div
        onClick={onSelect}
        className="q-card"
        style={{
          cursor: "pointer",
          padding: "1.2rem 1.4rem",
          border: isSelected ? `2px solid ${track.color}` : "1px solid var(--border-light)",
          background: isSelected ? track.bgGradient : "var(--surface-card)",
          boxShadow: isSelected ? `0 10px 25px -5px rgba(0, 0, 0, 0.08)` : "var(--shadow-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "var(--radius-md)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SubjectTrackIconBadge
            icon={track.icon}
            color={track.color}
            isSelected={isSelected}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <SubjectTrackMetaTag code={track.code} color={track.color} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0 }}>{track.name}</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
              {track.modulesCount} chương học • {track.runtime}
            </p>
          </div>
        </div>

        <ChevronRight size={18} color={isSelected ? track.color : "#94a3b8"} />
      </div>
    </TiltCard3D>
  );
}
