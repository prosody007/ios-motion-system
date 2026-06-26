const circleClasses = [
  "circle-12",
  "circle-11",
  "circle-10",
  "circle-9",
  "circle-8",
  "circle-7",
  "circle-6",
  "circle-5",
  "circle-4",
  "circle-3",
  "circle-2",
  "circle-1",
];

const sparkleClasses = [
  "sparkle-1",
  "sparkle-2",
  "sparkle-3",
  "sparkle-4",
  "sparkle-5",
  "sparkle-6",
  "sparkle-7",
  "sparkle-8",
];

function UiverseButton({
  label,
  animated = true,
  includeStyle = false,
}: {
  label: string;
  animated?: boolean;
  includeStyle?: boolean;
}) {
  return (
    <>
      {includeStyle ? (
        <style>{`
        .uiverse {
          width: 50%;
          --duration: 7s;
          --easing: linear;
          --c-color-1: rgba(78, 255, 233, 0.68);
          --c-color-2: #0A5CFF;
          --c-color-3: #18C8FF;
          --c-color-4: rgba(0, 198, 255, 0.72);
          --c-shadow: rgba(0, 122, 255, 0.34);
          --c-shadow-inset-top: rgba(142, 202, 255, 0.92);
          --c-shadow-inset-bottom: rgba(0, 78, 210, 0.5);
          --c-radial-inner: #3395FF;
          --c-radial-outer: #007AFF;
          --c-color: #fff;
          -webkit-tap-highlight-color: transparent;
          -webkit-appearance: none;
          outline: none;
          position: relative;
          cursor: pointer;
          border: none;
          display: table;
          border-radius: 24px;
          padding: 0;
          margin: 0;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          color: var(--c-color);
          background: radial-gradient(
            circle,
            var(--c-radial-inner),
            var(--c-radial-outer) 80%
          );
          box-shadow: 0 0 14px var(--c-shadow);
          transition: transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-origin: center;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        .uiverse.is-static .circle,
        .uiverse.is-static .sparkle {
          animation-play-state: paused;
        }

        .uiverse:active {
          transform: scale(0.96);
        }

        .uiverse:before {
          content: "";
          position: absolute;
          z-index: 3;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          box-shadow:
            inset 0 3px 12px var(--c-shadow-inset-top),
            inset 0 -3px 4px var(--c-shadow-inset-bottom);
        }

        .uiverse .wrapper {
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          overflow: hidden;
          border-radius: 24px;
          width: 100%;
          padding: 12px 0;
          isolation: isolate;
        }

        .uiverse .wrapper span {
          display: inline-block;
          position: relative;
          z-index: 2;
        }

        .uiverse .wrapper .circle {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          filter: blur(var(--blur, 8px));
          background: var(--background, transparent);
          transform: translate(var(--x, 0), var(--y, 0)) translateZ(0);
          animation: var(--animation, none) var(--duration) var(--easing) infinite;
          transition: filter 180ms ease;
        }

        .uiverse .wrapper .sparkle {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size, 3px);
          height: var(--size, 3px);
          z-index: 1;
          opacity: var(--opacity, .55);
          transform: translateZ(0);
          animation:
            var(--sparkle-move) var(--sparkle-duration) ease-in-out infinite,
            sparkle-twinkle 2200ms ease-in-out infinite;
          transition: opacity 160ms ease;
        }

        .uiverse .wrapper .sparkle::before,
        .uiverse .wrapper .sparkle::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 1.5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .95);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 5px rgba(255,255,255,.85);
        }

        .uiverse .wrapper .sparkle::after {
          transform: translate(-50%, -50%) rotate(90deg);
        }

        .uiverse .wrapper .circle.circle-1,
        .uiverse .wrapper .circle.circle-9,
        .uiverse .wrapper .circle.circle-10 {
          --background: var(--c-color-4);
        }

        .uiverse .wrapper .circle.circle-3,
        .uiverse .wrapper .circle.circle-4 {
          --background: var(--c-color-2);
          --blur: 14px;
        }

        .uiverse .wrapper .circle.circle-5,
        .uiverse .wrapper .circle.circle-6 {
          --background: var(--c-color-3);
          --blur: 16px;
        }

        .uiverse .wrapper .circle.circle-2,
        .uiverse .wrapper .circle.circle-7,
        .uiverse .wrapper .circle.circle-8,
        .uiverse .wrapper .circle.circle-11,
        .uiverse .wrapper .circle.circle-12 {
          --background: var(--c-color-1);
          --blur: 12px;
        }

        .uiverse .wrapper .sparkle.sparkle-1 { --x: 10%; --y: 12px; --size: 3px; --opacity: .62; --sparkle-duration: 7600ms; --sparkle-move: sparkle-drift-1; }
        .uiverse .wrapper .sparkle.sparkle-2 { --x: 24%; --y: 28px; --size: 2.5px; --opacity: .48; --sparkle-duration: 9400ms; --sparkle-move: sparkle-drift-2; }
        .uiverse .wrapper .sparkle.sparkle-3 { --x: 39%; --y: 10px; --size: 3.5px; --opacity: .58; --sparkle-duration: 8200ms; --sparkle-move: sparkle-drift-3; }
        .uiverse .wrapper .sparkle.sparkle-4 { --x: 56%; --y: 26px; --size: 2.25px; --opacity: .5; --sparkle-duration: 10200ms; --sparkle-move: sparkle-drift-4; }
        .uiverse .wrapper .sparkle.sparkle-5 { --x: 70%; --y: 12px; --size: 3px; --opacity: .52; --sparkle-duration: 8800ms; --sparkle-move: sparkle-drift-5; }
        .uiverse .wrapper .sparkle.sparkle-6 { --x: 83%; --y: 22px; --size: 2px; --opacity: .42; --sparkle-duration: 11100ms; --sparkle-move: sparkle-drift-6; }
        .uiverse .wrapper .sparkle.sparkle-7 { --x: 92%; --y: 30px; --size: 2.5px; --opacity: .46; --sparkle-duration: 9700ms; --sparkle-move: sparkle-drift-7; }
        .uiverse .wrapper .sparkle.sparkle-8 { --x: 4%; --y: 22px; --size: 2px; --opacity: .42; --sparkle-duration: 11800ms; --sparkle-move: sparkle-drift-8; }

        .uiverse .wrapper .circle.circle-1 {
          --x: 0;
          --y: -40px;
          --animation: circle-1;
        }

        .uiverse .wrapper .circle.circle-2 {
          --x: 92px;
          --y: 8px;
          --animation: circle-2;
        }

        .uiverse .wrapper .circle.circle-3 {
          --x: -12px;
          --y: -12px;
          --animation: circle-3;
        }

        .uiverse .wrapper .circle.circle-4 {
          --x: 80px;
          --y: -12px;
          --animation: circle-4;
        }

        .uiverse .wrapper .circle.circle-5 {
          --x: 12px;
          --y: -4px;
          --animation: circle-5;
        }

        .uiverse .wrapper .circle.circle-6 {
          --x: 56px;
          --y: 16px;
          --animation: circle-6;
        }

        .uiverse .wrapper .circle.circle-7 {
          --x: 8px;
          --y: 28px;
          --animation: circle-7;
        }

        .uiverse .wrapper .circle.circle-8 {
          --x: 28px;
          --y: -4px;
          --animation: circle-8;
        }

        .uiverse .wrapper .circle.circle-9 {
          --x: 20px;
          --y: -12px;
          --animation: circle-9;
        }

        .uiverse .wrapper .circle.circle-10 {
          --x: 64px;
          --y: 16px;
          --animation: circle-10;
        }

        .uiverse .wrapper .circle.circle-11 {
          --x: 4px;
          --y: 4px;
          --animation: circle-11;
        }

        .uiverse .wrapper .circle.circle-12 {
          --blur: 14px;
          --x: 52px;
          --y: 4px;
          --animation: circle-12;
        }

        @keyframes circle-1 {
          33% { transform: translateY(16px) translateZ(0); }
          66% { transform: translate(12px, 64px) translateZ(0); }
        }

        @keyframes circle-2 {
          33% { transform: translate(80px, -10px) translateZ(0); }
          66% { transform: translate(72px, -48px) translateZ(0); }
        }

        @keyframes circle-3 {
          33% { transform: translate(20px, 12px) translateZ(0); }
          66% { transform: translate(12px, 4px) translateZ(0); }
        }

        @keyframes circle-4 {
          33% { transform: translate(76px, -12px) translateZ(0); }
          66% { transform: translate(112px, -8px) translateZ(0); }
        }

        @keyframes circle-5 {
          33% { transform: translate(84px, 28px) translateZ(0); }
          66% { transform: translate(40px, -32px) translateZ(0); }
        }

        @keyframes circle-6 {
          33% { transform: translate(28px, -16px) translateZ(0); }
          66% { transform: translate(76px, -56px) translateZ(0); }
        }

        @keyframes circle-7 {
          33% { transform: translate(8px, 28px) translateZ(0); }
          66% { transform: translate(20px, -60px) translateZ(0); }
        }

        @keyframes circle-8 {
          33% { transform: translate(32px, -4px) translateZ(0); }
          66% { transform: translate(56px, -20px) translateZ(0); }
        }

        @keyframes circle-9 {
          33% { transform: translate(20px, -12px) translateZ(0); }
          66% { transform: translate(80px, -8px) translateZ(0); }
        }

        @keyframes circle-10 {
          33% { transform: translate(68px, 20px) translateZ(0); }
          66% { transform: translate(100px, 28px) translateZ(0); }
        }

        @keyframes circle-11 {
          33% { transform: translate(4px, 4px) translateZ(0); }
          66% { transform: translate(68px, 20px) translateZ(0); }
        }

        @keyframes circle-12 {
          33% { transform: translate(56px, 0) translateZ(0); }
          66% { transform: translate(60px, -32px) translateZ(0); }
        }

        @keyframes sparkle-twinkle {
          0%, 100% { scale: .75; opacity: .38; }
          45% { scale: 1.18; opacity: 1; }
          70% { scale: .92; opacity: .58; }
        }

        @keyframes sparkle-drift-1 {
          50% { transform: translate(12px, -6px) rotate(24deg); }
        }

        @keyframes sparkle-drift-2 {
          50% { transform: translate(-10px, 7px) rotate(-18deg); }
        }

        @keyframes sparkle-drift-3 {
          50% { transform: translate(10px, 10px) rotate(32deg); }
        }

        @keyframes sparkle-drift-4 {
          50% { transform: translate(-12px, -8px) rotate(-26deg); }
        }

        @keyframes sparkle-drift-5 {
          50% { transform: translate(9px, 12px) rotate(20deg); }
        }

        @keyframes sparkle-drift-6 {
          50% { transform: translate(-12px, 6px) rotate(-34deg); }
        }

        @keyframes sparkle-drift-7 {
          50% { transform: translate(-10px, -10px) rotate(28deg); }
        }

        @keyframes sparkle-drift-8 {
          50% { transform: translate(12px, 8px) rotate(-20deg); }
        }
      `}</style>
      ) : null}
      <button className={`uiverse ${animated ? "" : "is-static"}`} type="button">
        <div className="wrapper">
          <span>{label}</span>
          {circleClasses.map((circleClass) => (
            <div key={circleClass} className={`circle ${circleClass}`} />
          ))}
          {sparkleClasses.map((sparkleClass) => (
            <div key={sparkleClass} className={`sparkle ${sparkleClass}`} />
          ))}
        </div>
      </button>
    </>
  );
}

export function UiverseButtonDemo() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-6">
      <div className="flex aspect-square items-center justify-center rounded-[24px] bg-white">
        <UiverseButton label="Button" includeStyle />
      </div>
    </div>
  );
}
