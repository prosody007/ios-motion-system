export function springPosition(
  t: number,
  damping: number,
  response: number
): number {
  const omega = (2 * Math.PI) / response;
  const zeta = damping;
  if (zeta >= 1) {
    const expDecay = Math.exp(-omega * zeta * t);
    return 1 - expDecay * (1 + omega * zeta * t);
  }
  const omegaD = omega * Math.sqrt(1 - zeta * zeta);
  const expDecay = Math.exp(-zeta * omega * t);
  return (
    1 -
    expDecay *
      (Math.cos(omegaD * t) +
        (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t))
  );
}

export function cubicBezierX(t: number, x1: number, x2: number): number {
  return 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
}

export function cubicBezierY(t: number, y1: number, y2: number): number {
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}

export function springPositionV(
  t: number,
  damping: number,
  response: number,
  initialVelocity = 0
): number {
  const omega = (2 * Math.PI) / response;
  const zeta = damping;
  if (zeta >= 1) {
    const expDecay = Math.exp(-omega * zeta * t);
    return 1 - expDecay * (1 + (omega * zeta - initialVelocity) * t);
  }
  const omegaD = omega * Math.sqrt(1 - zeta * zeta);
  const expDecay = Math.exp(-zeta * omega * t);
  return (
    1 -
    expDecay *
      (Math.cos(omegaD * t) +
        ((zeta * omega - initialVelocity) / omegaD) * Math.sin(omegaD * t))
  );
}

export function springKeyframes(
  transform: (v: number) => string,
  opts: { response: number; damping: number; duration: number; steps?: number }
): string {
  const { response, damping, duration, steps = 50 } = opts;
  let css = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * duration;
    const v = springPosition(t, damping, response);
    const pct = ((i / steps) * 100).toFixed(2);
    css += `${pct}%{transform:${transform(v)}}`;
  }
  return css;
}
