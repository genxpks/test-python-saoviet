"use client";

import TiltCard3D from "../TiltCard3D";
import SyllabusTopicList from "./SyllabusTopicList";
import SyllabusCodePreview from "./SyllabusCodePreview";
import SyllabusActionFooter from "./SyllabusActionFooter";

interface SyllabusInspectorPanelProps {
  selectedTrack: any;
}

export default function SyllabusInspectorPanel({ selectedTrack }: SyllabusInspectorPanelProps) {
  return (
    <TiltCard3D maxTilt={5} scale={1.01}>
      <div className="q-card" style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTop: `4px solid ${selectedTrack.color}`,
        background: "var(--surface-card)",
        height: "100%",
        borderRadius: "var(--radius-lg)"
      }}>
        <div>
          {/* Header info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
            <div>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: selectedTrack.color,
                background: `${selectedTrack.color}15`,
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                display: "inline-block",
                marginBottom: "0.4rem"
              }}>
                CHI TIẾT CHƯƠNG TRÌNH ĐÀO TẠO
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {selectedTrack.name}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                {selectedTrack.tagline}
              </p>
            </div>
          </div>

          {/* Module Topics Checklist */}
          <SyllabusTopicList topics={selectedTrack.highlightTopics} color={selectedTrack.color} />

          {/* Sample Code Preview */}
          <SyllabusCodePreview
            runtime={selectedTrack.runtime}
            sampleQuestion={selectedTrack.sampleQuestion}
            sampleCode={selectedTrack.sampleCode}
            color={selectedTrack.color}
          />
        </div>

        {/* Action Footer */}
        <SyllabusActionFooter />
      </div>
    </TiltCard3D>
  );
}
