"use client";

import SubjectTrackCard from "./SubjectTrackCard";

interface SubjectTrackListProps {
  tracks: any[];
  selectedTrackId: string;
  onSelectTrack: (track: any) => void;
}

export default function SubjectTrackList({ tracks, selectedTrackId, onSelectTrack }: SubjectTrackListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
      {tracks.map((track) => (
        <SubjectTrackCard
          key={track.id}
          track={track}
          isSelected={selectedTrackId === track.id}
          onSelect={() => onSelectTrack(track)}
        />
      ))}
    </div>
  );
}
