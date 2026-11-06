import { useId } from "react";

/** Ícone do IRIS Link: dois Macs ligados por um raio, no degradê Noite (IRIS LINK/branding/irislink-icon.svg). */
export default function IrisLinkMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const id = `noite-${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
          <stop offset="0" stopColor="#6B55F0" />
          <stop offset="0.55" stopColor="#3A2DA8" />
          <stop offset="1" stopColor="#1A1446" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22.5" fill={`url(#${id})`} />
      <path d="M37 50h26" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <rect x="15" y="31" width="24" height="38" rx="6.5" fill="#fff" />
      <rect x="61" y="31" width="24" height="38" rx="6.5" fill="#fff" />
      <circle cx="27" cy="60" r="2.6" fill={`url(#${id})`} />
      <circle cx="73" cy="60" r="2.6" fill={`url(#${id})`} />
      <path d="M21 39h12M67 39h12" stroke={`url(#${id})`} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M51.5 41.5l-5 9h7l-5 9" fill="none" stroke={`url(#${id})`} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M51.5 41.5l-5 9h7l-5 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
