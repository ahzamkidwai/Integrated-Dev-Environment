import { useRef, useEffect } from "react";

type ConsoleProps = {
  lines: string[];
};

export default function Console({ lines }: ConsoleProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={ref}
      style={{
        background: "#0b1220",
        color: "#b4f8c8",
        padding: 12,
        height: 180,
        borderRadius: 6,
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: 13,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      {lines.length === 0 ? (
        <div style={{ opacity: 0.6 }}>
          Console is empty. Run your code to see output.
        </div>
      ) : (
        lines.map((l, i) => (
          <div key={i}>
            <span style={{ opacity: 0.7 }}>{i + 1}.</span> {l}
          </div>
        ))
      )}
    </div>
  );
}
