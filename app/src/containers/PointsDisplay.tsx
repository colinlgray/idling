import { useProgram, useNotify } from "../hooks";

export function PointsDisplay() {
  const program = useProgram();
  (window as any).asd = program;

  return <div className="flex justify-end">Points: 0</div>;
}
