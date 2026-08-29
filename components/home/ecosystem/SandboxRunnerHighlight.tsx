"use client";

import { Cpu } from "lucide-react";

export default function SandboxRunnerHighlight() {
  return (
    <div style={{
      textAlign: "center",
      marginTop: "0.8rem",
      fontSize: "0.82rem",
      color: "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem"
    }}>
      <Cpu size={14} color="var(--brand-violet)" />
      <span>Trình biên dịch web cô lập 100% tài nguyên người dùng.</span>
    </div>
  );
}
