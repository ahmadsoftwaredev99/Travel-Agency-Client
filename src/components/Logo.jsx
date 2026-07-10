// Logo.jsx
const Logo = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: { circle: "w-8 h-8", text: "text-lg", te: "text-[10px]" },
    md: { circle: "w-10 h-10", text: "text-2xl", te: "text-xs" },
    lg: { circle: "w-14 h-14", text: "text-4xl", te: "text-sm" },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Circle monogram mark */}
      <div
        className={`${s.circle} rounded-full border-2 border-[#1a2b4a] flex items-center justify-center shrink-0 bg-[#faf6ef]`}
      >
        <span
          className={`${s.te} font-semibold tracking-wide text-[#1a2b4a]`}
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          TE
        </span>
      </div>

      {/* Wordmark */}
      <span
        className={`${s.text} leading-none`}
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        <span className="font-bold text-[#1a2b4a]">travel</span>
        <span className="font-semibold text-[#ff6b4a]">ease</span>
      </span>
    </div>
  );
};

export default Logo;
