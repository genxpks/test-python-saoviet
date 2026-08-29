"use client";

import { useState } from "react";
import TiltCard3D from "@/components/home/TiltCard3D";

// 10 Atomic Micro-Components
import SimulatorSectionHeader from "./simulator/SimulatorSectionHeader";
import ArchetypeNavTabs from "./simulator/ArchetypeNavTabs";
import SingleChoiceSimulator from "./simulator/SingleChoiceSimulator";
import TrueFalseSimulator from "./simulator/TrueFalseSimulator";
import MultiChoiceSimulator from "./simulator/MultiChoiceSimulator";
import FillBlankSimulator from "./simulator/FillBlankSimulator";
import SequenceOrderSimulator from "./simulator/SequenceOrderSimulator";
import MatchingPairsSimulator from "./simulator/MatchingPairsSimulator";
import SimulatorFooterCallout from "./simulator/SimulatorFooterCallout";

type Archetype = "single_choice" | "true_false" | "multiple_choice" | "fill_blank" | "sequence_order" | "matching";

export default function InteractiveEngine3D() {
  const [activeArchetype, setActiveArchetype] = useState<Archetype>("single_choice");

  // State for interactive test drives
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState<number | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [multiChoiceAnswers, setMultiChoiceAnswers] = useState<number[]>([]);
  const [fillBlankInput, setFillBlankInput] = useState("");
  const [orderItems, setOrderItems] = useState(["print(total)", "total = a + b", "a = 10", "b = 20"]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    const updated = [...orderItems];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderItems(updated);
  };

  const handleToggleMulti = (idx: number) => {
    if (multiChoiceAnswers.includes(idx)) {
      setMultiChoiceAnswers(multiChoiceAnswers.filter(x => x !== idx));
    } else {
      setMultiChoiceAnswers([...multiChoiceAnswers, idx]);
    }
  };

  const handleMatch = (key: string, val: string) => {
    setMatchedPairs({ ...matchedPairs, [key]: val });
  };

  return (
    <section style={{ marginBottom: "4rem" }}>
      {/* 1. Header Micro-Component */}
      <SimulatorSectionHeader />

      {/* 2. Archetype Navigation Tabs */}
      <ArchetypeNavTabs
        activeArchetype={activeArchetype}
        onSelectArchetype={setActiveArchetype}
      />

      {/* 3. 3D Workbench Card with Sub-Simulators */}
      <TiltCard3D maxTilt={4} scale={1.01}>
        <div className="q-card" style={{ maxWidth: "840px", margin: "0 auto", padding: "2.2rem", background: "var(--surface-card)", borderRadius: "var(--radius-lg)" }}>
          {activeArchetype === "single_choice" && (
            <SingleChoiceSimulator
              answer={singleChoiceAnswer}
              onSelectAnswer={setSingleChoiceAnswer}
            />
          )}

          {activeArchetype === "true_false" && (
            <TrueFalseSimulator
              answer={trueFalseAnswer}
              onSelectAnswer={setTrueFalseAnswer}
            />
          )}

          {activeArchetype === "multiple_choice" && (
            <MultiChoiceSimulator
              answers={multiChoiceAnswers}
              onToggleAnswer={handleToggleMulti}
            />
          )}

          {activeArchetype === "fill_blank" && (
            <FillBlankSimulator
              input={fillBlankInput}
              onChangeInput={setFillBlankInput}
            />
          )}

          {activeArchetype === "sequence_order" && (
            <SequenceOrderSimulator
              orderItems={orderItems}
              onMoveItem={moveOrderItem}
            />
          )}

          {activeArchetype === "matching" && (
            <MatchingPairsSimulator
              matchedPairs={matchedPairs}
              onMatch={handleMatch}
            />
          )}

          {/* 10. Footer Callout Micro-Component */}
          <SimulatorFooterCallout />
        </div>
      </TiltCard3D>
    </section>
  );
}
