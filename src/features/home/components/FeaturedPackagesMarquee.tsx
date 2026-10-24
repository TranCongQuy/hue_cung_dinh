import { useRef } from "react";
import { GoiCuoi } from "../../packages/types";
import { PackageCard } from "../../packages/components/PackageCard";
import { Icon } from "../../../components/common/Icon";
import "./FeaturedPackagesMarquee.css";

interface Props {
  packages: GoiCuoi[];
}

export function FeaturedPackagesMarquee({ packages }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayItems = packages.length > 0 ? [...packages, ...packages] : [];

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="packages-marquee-wrapper" aria-label="Danh sách gói cưới chạy liên tục">
      <button
        type="button"
        className="marquee-control-btn btn-prev"
        onClick={() => handleScroll("left")}
        aria-label="Cuộn sang trái"
      >
        <Icon name="chevronDown" size={18} />
      </button>

      <div className="packages-marquee-viewport" ref={scrollRef}>
        <div className="packages-marquee-track">
          {displayItems.map((pkg, idx) => (
            <div key={`${pkg.id}-${idx}`} className="marquee-card-item">
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="marquee-control-btn btn-next"
        onClick={() => handleScroll("right")}
        aria-label="Cuộn sang phải"
      >
        <Icon name="chevronDown" size={18} />
      </button>
    </div>
  );
}

