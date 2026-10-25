import "./FixedFloatingRings.css";

export function FixedFloatingRings() {
  return (
    <div className="fixed-floating-rings-layer" aria-hidden="true">
      <div className="fixed-ring ring-top-left">
        <svg viewBox="0 0 48 48" className="svg-fixed-ring">
          <circle cx="24" cy="24" r="18" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
          <polygon points="24,3 28,9 20,9" fill="#FFF9E6" stroke="#D4AF37" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="fixed-ring ring-top-right">
        <svg viewBox="0 0 42 42" className="svg-fixed-ring">
          <circle cx="21" cy="21" r="16" stroke="#F59E0B" strokeWidth="2" fill="none" />
          <polygon points="21,2 25,8 17,8" fill="#FFF9E6" stroke="#F59E0B" strokeWidth="1" />
        </svg>
      </div>
      <div className="fixed-ring ring-center-left">
        <svg viewBox="0 0 44 44" className="svg-fixed-ring">
          <circle cx="22" cy="22" r="16" stroke="#E6CA65" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
      <div className="fixed-ring ring-bottom-right">
        <svg viewBox="0 0 52 52" className="svg-fixed-ring">
          <circle cx="26" cy="26" r="20" stroke="#C5A059" strokeWidth="2.5" fill="none" />
          <circle cx="26" cy="26" r="17" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        </svg>
      </div>
      <div className="fixed-ring ring-bottom-left">
        <svg viewBox="0 0 38 38" className="svg-fixed-ring">
          <circle cx="19" cy="19" r="14" stroke="#D4AF37" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
}

