"use client";

import { CheckCircle2, X } from "lucide-react";

interface SimulatorFeedbackAlertProps {
  isCorrect: boolean;
  message: string;
}

export default function SimulatorFeedbackAlert({ isCorrect, message }: SimulatorFeedbackAlertProps) {
  return (
    <div style={{
      padding: "0.8rem 1rem",
      borderRadius: "var(--radius-md)",
      background: isCorrect ? "#ecfdf5" : "#fef2f2",
      border: isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
      color: isCorrect ? "#047857" : "#b91c1c",
      fontSize: "0.88rem",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem"
    }}>
      {isCorrect ? <CheckCircle2 size={18} /> : <X size={18} />}
      <span>{message}</span>
    </div>
  );
}
