"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Console from "@/components/Console";
import { themes, ThemeKey } from "@/styles/globalStyles";

const CodeEditor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

const LANGS = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
];

export default function IDEPage() {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(
    `console.log("Hello from sandboxed JS");`
  );
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [theme, setTheme] = useState<ThemeKey>("light");
  const activeTheme = themes[theme];

  const createIframeSrc = (userCode: string): string => {
    return `
<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function() {
        function send(type, args) {
          try {
            const s = args.map(a => {
              try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
              catch(e){ return String(a); }
            }).join(' ');
            parent.postMessage({ __IDE_SANDBOX: true, type: type, message: s }, "*");
          } catch(e) { }
        }
        console.log = (...args) => send('log', args);
        console.error = (...args) => send('error', args);
        try {
          ${userCode}
        } catch (err) {
          send('error', [err.stack || String(err)]);
        }
        parent.postMessage({ __IDE_SANDBOX: true, type: 'done', message: 'Execution finished' }, "*");
      })();
    </script>
  </body>
</html>`;
  };

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const d = ev.data as any;
      if (!d || d.__IDE_SANDBOX !== true) return;
      setConsoleLines((prev) => [...prev, `[${d.type}] ${d.message}`]);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const runCode = () => {
    if (language !== "javascript") {
      setConsoleLines((prev) => [
        ...prev,
        `[info] Running ${language} is not implemented in-browser.`,
        `[hint] Use Judge0 API or Pyodide for server-side execution.`,
      ]);
      return;
    }
    if (iframeRef.current) {
      iframeRef.current.srcdoc = createIframeSrc(code);
    }
  };

  const clearConsole = () => setConsoleLines([]);

  return (
    <div
      style={{
        padding: 18,
        fontFamily: "Inter, system-ui, sans-serif",
        background: activeTheme.background,
        color: activeTheme.text,
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Minimal Next.js IDE (JS runs in-browser)</h2>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeKey)}
          style={{
            padding: "8px 14px",
            cursor: "pointer",
            background: activeTheme.selectBg,
            color: activeTheme.selectText,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            transition: "all 0.2s ease-in-out",
            appearance: "none", // hide default arrow
            WebkitAppearance: "none",
            MozAppearance: "none",
            position: "relative",
            paddingRight: "32px", // space for custom arrow
          }}
        >
          {Object.entries(themes).map(([key, t]) => (
            <option
              key={key}
              value={key}
              style={{
                background: activeTheme.background,
                color: activeTheme.text,
              }}
            >
              {t.name}
            </option>
          ))}
        </select>

        {/* custom dropdown arrow */}
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: activeTheme.text,
            fontSize: 12,
          }}
        >
          ▼
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div>
          <label style={{ marginRight: 6 }}>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: activeTheme.selectBg,
              color: activeTheme.selectText,
              padding: "4px 6px",
              border: `1px solid ${activeTheme.border}`,
            }}
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <button
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            background: activeTheme.buttonBg,
            color: activeTheme.buttonText,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: 4,
          }}
          onClick={runCode}
        >
          Run ▶
        </button>
        <button
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            background: activeTheme.buttonBg,
            color: activeTheme.buttonText,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: 4,
          }}
          onClick={clearConsole}
        >
          Clear Console
        </button>
      </div>

      <CodeEditor
        code={code}
        setCode={setCode}
        language={language as "javascript" | "python" | "java" | "cpp"}
        darkMode={activeTheme.monaco === "vs-dark"}
      />

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 12,
        }}
      >
        <Console
          lines={consoleLines}
          darkMode={activeTheme.monaco === "vs-dark"}
        />
        <iframe
          title="sandbox-runner"
          ref={iframeRef}
          sandbox="allow-scripts"
          style={{
            display: "none",
          }}
        />
      </div>
    </div>
  );
}
