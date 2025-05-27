import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const slides = [
  {
    text: "lorem ipsum dolor sit amet, consecdolor sit amettetur adipiscing elit.",
    img: "/screens/manage.jpg",
  },
  {
    text: "lorem ipsum dolor sit amet, dolor sit ametdolor sit amet  elit.",
    img: "/screens/stats.jpg",
  },
  {
    text: "lorem ipsum consectetur adipiscing elit, consectetur adipiscing elit.",
    img: "/screens/workers.jpg",
  },
  {
    text: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    img: "/screens/tasks.jpg",
  },
];

const SLIDE_DURATION = 4000;
const FADE_DURATION = 400;

export default function LandingSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect to handle automatic slide change
  useEffect(() => {
    if (isManual) return;

    timeoutRef.current = setTimeout(() => {
      setPrev(current);
      setIsFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsFading(false);
      }, FADE_DURATION);
    }, SLIDE_DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, isManual]);

  // manual slide change function
  const goToSlide = (idx: number) => {
    if (idx === current) return;
    setIsManual(true);
    setPrev(current);
    setIsFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsFading(false);
      setIsManual(false);
    }, FADE_DURATION);
  };

  // swipe handling
  const dragStartX = useRef<number | null>(null);
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };
  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const endX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goToSlide((current + 1) % slides.length);
      else goToSlide((current - 1 + slides.length) % slides.length);
    }
    dragStartX.current = null;
  };

  // rendering
  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] gap-8 mt-12 mb-12 bg-white/10 rounded-3xl shadow-xl p-8 w-[90%] relative">
      {/* crossfade text */}
      <div className="flex-1 flex flex-col justify-center items-start relative min-h-[80px]">
        {slides.map((slide, idx) => {
          // show only current and previous slides
          if (idx !== current && idx !== prev) return null;
          const isCurrent = idx === current;
          const isPrev = idx === prev;
          return (
            <h1
              key={idx}
              className={`absolute w-full transition-opacity duration-400 text-4xl md:text-5xl font-bold text-white mb-6
                ${isCurrent && (!isFading || prev === null) ? "opacity-100 z-20" : ""}
                ${isCurrent && isFading ? "opacity-100 z-20" : ""}
                ${isPrev && isFading ? "opacity-0 z-10" : ""}
                ${isPrev && !isFading ? "opacity-0 z-10" : ""}
              `}
              style={{
                pointerEvents: "none",
                transition: `opacity ${FADE_DURATION}ms`,
                opacity:
                  isCurrent && (!isFading || prev === null)
                    ? 1
                    : isCurrent && isFading
                    ? 1
                    : isPrev && isFading
                    ? 0
                    : 0,
              }}
            >
              {slide.text}
            </h1>
          );
        })}
      </div>

      {/* crossfade img */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div
          className="w-[480px] h-[245px] md:w-[1024px] md:h-[531px] bg-black rounded-2xl overflow-hidden shadow-lg relative select-none"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {slides.map((slide, idx) => {
            if (idx !== current && idx !== prev) return null;
            const isCurrent = idx === current;
            const isPrev = idx === prev;
            return (
              <Image
                key={idx}
                src={slide.img}
                alt="Zrzut ekranu aplikacji"
                width={1920}
                height={1080}
                className={`object-contain absolute left-0 top-0 w-full h-full transition-opacity duration-400
                  ${isCurrent && (!isFading || prev === null) ? "opacity-100 z-20" : ""}
                  ${isCurrent && isFading ? "opacity-100 z-20" : ""}
                  ${isPrev && isFading ? "opacity-0 z-10" : ""}
                  ${isPrev && !isFading ? "opacity-0 z-10" : ""}
                `}
                style={{
                  pointerEvents: "none",
                  transition: `opacity ${FADE_DURATION}ms`,
                  opacity:
                    isCurrent && (!isFading || prev === null)
                      ? 1
                      : isCurrent && isFading
                      ? 1
                      : isPrev && isFading
                      ? 0
                      : 0,
                }}
                draggable={false}
                priority={isCurrent}
              />
            );
          })}
        </div>

        {/* progress bars */}
        <div className="flex flex-row gap-2 w-1/2 mt-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
              onClick={() => goToSlide(idx)}
            >
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={
                  idx < current
                    ? { width: "100%", transition: "none" }
                    : idx > current
                    ? { width: "0%", transition: "none" }
                    : !isManual && !isFading
                    ? {
                        width: "100%",
                        transform: "translateX(-100%)",
                        animation: `progressBar ${SLIDE_DURATION}ms linear forwards`,
                      }
                    : { width: "100%" }
                }
              />
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes progressBar {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0%);
            }
          }
        `}</style>
      </div>
    </section>
  );
}