import "./FixedFloatingRings.css";

export function FixedFloatingRings() {
  return (
    <div className="fixed-floating-rings-layer" aria-hidden="true">
      {/* 1. Nhẫn cưới vàng kim cương góc trên trái */}
      <div className="float-item item-ring ring-1">
        <svg viewBox="0 0 48 48" className="svg-float">
          <circle cx="24" cy="26" r="16" stroke="#D4AF37" strokeWidth="2.8" fill="none" />
          <circle cx="24" cy="26" r="13" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <polygon points="24,3 29,10 19,10" fill="#FFFBEB" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 2. Trái tim son đỏ thắm góc trên trái */}
      <div className="float-item item-heart heart-1">
        <svg viewBox="0 0 48 48" className="svg-float">
          <path
            d="M24,42 C12,30 4,22 4,14 C4,7 9,2 16,2 C20.5,2 23,4.5 24,6.5 C25,4.5 27.5,2 32,2 C39,2 44,7 44,14 C44,22 36,30 24,42 Z"
            fill="url(#rubyGradient)"
            stroke="#B91C1C"
            strokeWidth="1.2"
          />
          <defs>
            <linearGradient id="rubyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Nhẫn đôi lồng nhau hoàng gia góc trên phải */}
      <div className="float-item item-ring ring-2">
        <svg viewBox="0 0 54 44" className="svg-float">
          <circle cx="18" cy="22" r="14" stroke="#D4AF37" strokeWidth="2.4" fill="none" />
          <circle cx="34" cy="22" r="14" stroke="#F59E0B" strokeWidth="2.4" fill="none" />
        </svg>
      </div>

      {/* 4. Kim cương lấp lánh góc trên trung tâm */}
      <div className="float-item item-gem gem-1">
        <svg viewBox="0 0 36 36" className="svg-float">
          <polygon points="18,2 34,18 18,34 2,18" fill="rgba(212,175,55,0.25)" stroke="#D4AF37" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="4" fill="#D4AF37" />
        </svg>
      </div>

      {/* 5. Trái tim đỏ thắm giữa màn hình trái */}
      <div className="float-item item-heart heart-2">
        <svg viewBox="0 0 40 40" className="svg-float">
          <path
            d="M20,35 C10,25 3,18 3,11 C3,5 7,1 13,1 C17,1 19,3 20,5 C21,3 23,1 27,1 C33,1 37,5 37,11 C37,18 30,25 20,35 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 6. Nhẫn vàng đính ngọc giữa màn hình */}
      <div className="float-item item-ring ring-3">
        <svg viewBox="0 0 44 44" className="svg-float">
          <circle cx="22" cy="24" r="15" stroke="#C5A059" strokeWidth="2.6" fill="none" />
          <circle cx="22" cy="7" r="4" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="1.4" />
        </svg>
      </div>

      {/* 7. Trái tim đỏ son giữa màn hình phải */}
      <div className="float-item item-heart heart-3">
        <svg viewBox="0 0 46 46" className="svg-float">
          <path
            d="M23,40 C11,28 3,21 3,13 C3,6 8,1 15,1 C19.5,1 22,3.5 23,5.5 C24,3.5 26.5,1 31,1 C38,1 43,6 43,13 C43,21 35,28 23,40 Z"
            fill="#E11D48"
            stroke="#9F1239"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* 8. Nhẫn cưới vàng lớn góc dưới phải */}
      <div className="float-item item-ring ring-4">
        <svg viewBox="0 0 52 52" className="svg-float">
          <circle cx="26" cy="28" r="18" stroke="#D4AF37" strokeWidth="2.8" fill="none" />
          <polygon points="26,3 32,10 20,10" fill="#FFFDF0" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 9. Trái tim đỏ nhỏ góc dưới phải */}
      <div className="float-item item-heart heart-4">
        <svg viewBox="0 0 32 32" className="svg-float">
          <path
            d="M16,28 C8,20 2,14 2,9 C2,4 5,1 10,1 C13.5,1 15,2.5 16,4 C17,2.5 18.5,1 22,1 C27,1 30,4 30,9 C30,14 24,20 16,28 Z"
            fill="#B91C1C"
            stroke="#7F1D1D"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 10. Hoa sen kim cương vàng góc dưới trái */}
      <div className="float-item item-gem gem-2">
        <svg viewBox="0 0 40 40" className="svg-float">
          <path
            d="M20,4 C22,14 32,18 36,20 C32,22 22,26 20,36 C18,26 8,22 4,20 C8,18 18,14 20,4 Z"
            fill="rgba(212,175,55,0.3)"
            stroke="#D4AF37"
            strokeWidth="1.6"
          />
        </svg>
      </div>

      {/* 11. Nhẫn cưới góc dưới trái */}
      <div className="float-item item-ring ring-5">
        <svg viewBox="0 0 40 40" className="svg-float">
          <circle cx="20" cy="20" r="15" stroke="#E6CA65" strokeWidth="2.4" fill="none" />
        </svg>
      </div>

      {/* 12. Trái tim đỏ góc dưới trái */}
      <div className="float-item item-heart heart-5">
        <svg viewBox="0 0 38 38" className="svg-float">
          <path
            d="M19,33 C9.5,23.5 2.5,17 2.5,10.5 C2.5,5 6.5,1 12.5,1 C16,1 18,2.5 19,4.5 C20,2.5 22,1 25.5,1 C31.5,1 35.5,5 35.5,10.5 C35.5,17 28.5,23.5 19,33 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
