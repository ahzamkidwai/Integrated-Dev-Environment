import React from "react";
import MonacoEditor from "@monaco-editor/react";

type CodeEditorProps = {
  code: string;
  setCode: (value: string) => void;
  language: "javascript" | "python" | "cpp" | "java";
};

export default function CodeEditor({
  code,
  setCode,
  language,
}: CodeEditorProps) {
  // Monaco language mapping: monaco uses 'javascript', 'python', 'cpp', 'java'
  const monacoLang = language === "cpp" ? "cpp" : language;

  return (
    <div style={{ borderRadius: 6, overflow: "hidden" }}>
      <MonacoEditor
        height="56vh"
        defaultLanguage={monacoLang}
        language={monacoLang}
        value={code}
        onChange={(value) => setCode(value ?? "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
