import { useState } from 'react';

interface Props {
  claimText?: string;
  onCapture?: () => void;
  isScanning?: boolean;
}

export default function Viewfinder({ claimText, onCapture, isScanning }: Props) {
  const [flash, setFlash] = useState(false);
  const capture = () => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 150);
    onCapture?.();
  };

  return (
    <div className="viewfinder" aria-label="Cadre de visée de l’affirmation">
      <div className="viewfinder-corner corner-top-left" />
      <div className="viewfinder-corner corner-top-right" />
      <div className="viewfinder-corner corner-bottom-left" />
      <div className="viewfinder-corner corner-bottom-right" />
      <div className="claim-paper"><p>{claimText}</p></div>
      {flash && <div className="viewfinder-flash" />}
      {onCapture && (
        <button className="viewfinder-shutter" type="button" aria-label="Capturer" onClick={capture} disabled={isScanning} />
      )}
    </div>
  );
}
