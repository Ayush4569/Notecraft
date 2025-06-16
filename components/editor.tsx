"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { PartialBlock } from "@blocknote/core";
import { useDebounce } from "@/hooks/useDebounce";
import { useEditDocument } from "@/hooks/useUpdateDocument";

interface EditorProps {
  initialContent: PartialBlock[];
  onChange?: (content: { version: string; blocks: PartialBlock[] }) => void;
  editable?: boolean;
  docId: string;
}

export default function Editor({
  initialContent,
  onChange = () => {},
  editable,
  docId,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  // console.log("Editor mounted with initial content:", initialContent);
  
  const { mutate: updateDocument } = useEditDocument();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<PartialBlock[]>(initialContent || []);
  const debouncedValue = useDebounce(content, 5000);
  const editor = useCreateBlockNote({
    initialContent: initialContent ? initialContent : undefined,
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (debouncedValue.length === 0) return;
    if (JSON.stringify(debouncedValue) === JSON.stringify(initialContent)) return;
    updateDocument({
      docId,
      data: { content: { version: "0.31.2", blocks:content } },
    });
  }, [debouncedValue]);

  if (!mounted || !editor) return null;


  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={editable}
      onChange={() => {
        setContent(editor.document);
      }}
    />
  );
}
