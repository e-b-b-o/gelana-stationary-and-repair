/* ══════════════════════════════════════════
   SHARED UI
══════════════════════════════════════════ */

const STEPS = ["Contact", "Delivery", "Payment"];

export function Stepper({ current }) {
  return (
    <div className="flex items-center mb-12 w-full max-w-md mx-auto">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div
            key={label}
            className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  done
                    ? "bg-primary text-white border-2 border-primary"
                    : active
                      ? "bg-white text-primary border-2 border-primary"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-xs font-bold tracking-wider uppercase absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${
                  done || active ? "text-primary" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                  done ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
