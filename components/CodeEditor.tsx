"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  onRun?: () => void;
}

const CodeEditor = ({ value, onChange, language, onRun }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom theme to match PrepWise branding
    monaco.editor.defineTheme("prepwise-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6870a6" },
        { token: "keyword", foreground: "cac5fe" },
        { token: "string", foreground: "49de50" },
      ],
      colors: {
        "editor.background": "#08090D",
        "editor.lineHighlightBackground": "#27282f33",
        "editorCursor.foreground": "#cac5fe",
        "editor.selectionBackground": "#cac5fe33",
        "editorIndentGuide.background": "#242633",
      },
    });

    monaco.editor.setTheme("prepwise-dark");

    // Add hotkey Ctrl+Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });
  };

  // Re-map common language slugs to Monaco identifiers
  const monacoLanguage = language.toLowerCase() === "python" ? "python" : 
                         language.toLowerCase() === "javascript" || language.toLowerCase() === "react" ? "javascript" : 
                         language;

  return (
    <div className="h-full w-full bg-[#08090D] overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={monacoLanguage}
        language={monacoLanguage}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Mona Sans', monospace",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
