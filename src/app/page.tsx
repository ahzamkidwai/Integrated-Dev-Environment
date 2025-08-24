"use client";

// pages/index.tsx
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Console from "@/components/Console";

const CodeEditor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

type Lang = {
  id: string;
  label: string;
};

const LANGS: Lang[] = [
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

  // Build a fresh iframe srcdoc every time we Run so it starts clean
  const createIframeSrc = (userCode: string): string => {
    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Sandbox</title>
  </head>
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
        console.info = (...args) => send('info', args);
        console.warn = (...args) => send('warn', args);
        console.error = (...args) => send('error', args);
        window.onerror = function(msg, src, lineno, colno, err) {
          send('error', [msg + " (at " + lineno + ":" + colno + ")"]);
        };

        try {
          ${userCode}
        } catch (err) {
          send('error', [err && err.stack ? err.stack : String(err)]);
        }

        parent.postMessage({ __IDE_SANDBOX: true, type: 'done', message: 'Execution finished' }, "*");
      })();
    </script>
  </body>
</html>`;
    return html;
  };

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const d = ev.data as {
        __IDE_SANDBOX?: boolean;
        type?: string;
        message?: string;
      };
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
        `[hint] For ${language} you can hook a server executor (Judge0) or Pyodide for Python.`,
      ]);
      return;
    }

    const srcdoc = createIframeSrc(code);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcdoc;
    }
  };

  const clearConsole = () => setConsoleLines([]);

  return (
    <div style={{ padding: 18, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2>Minimal Next.js IDE (JS runs in-browser)</h2>

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
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={runCode}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Run ▶
        </button>
        <button
          onClick={clearConsole}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Clear Console
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.8 }}>
          <small>
            Note: JS runs in a sandboxed iframe. Other languages are
            placeholders.
          </small>
        </div>
      </div>

      <CodeEditor
        code={code}
        setCode={setCode}
        language={language as "javascript" | "python" | "java" | "cpp"}
      />

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 12,
        }}
      >
        <Console lines={consoleLines} />

        {/* <div>
          <div style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
            Sandbox iframe (hidden)
          </div>
          <iframe
            title="sandbox-runner"
            ref={iframeRef}
            sandbox="allow-scripts"
            style={{
              width: "100%",
              height: 200,
              border: "1px solid rgba(0,0,0,0.08)",
              display: "none",
            }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
            The iframe is sandboxed with <code>allow-scripts</code> only — no
            network or parent DOM access.
          </div>
        </div> */}
      </div>
    </div>
  );
}
