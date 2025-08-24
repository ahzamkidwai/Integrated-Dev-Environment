import MonacoEditor from "@monaco-editor/react";
import { colors } from "@/styles/globalStyles";

type CodeEditorProps = {
  code: string;
  setCode: (value: string) => void;
  language: "javascript" | "python" | "cpp" | "java";
  darkMode?: boolean;
};

export default function CodeEditor({
  code,
  setCode,
  language,
  darkMode = false,
}: CodeEditorProps) {
  const monacoLang = language === "cpp" ? "cpp" : language;

  return (
    <div
      style={{
        borderRadius: 6,
        overflow: "hidden",
        background: darkMode ? colors.dark.editorBg : colors.light.editorBg,
        border: `1px solid ${
          darkMode ? colors.dark.editorBorder : colors.light.editorBorder
        }`,
      }}
    >
      <MonacoEditor
        height="56vh"
        defaultLanguage={monacoLang}
        language={monacoLang}
        value={code}
        onChange={(value) => setCode(value ?? "")}
        theme={darkMode ? "vs-dark" : "light"}
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
