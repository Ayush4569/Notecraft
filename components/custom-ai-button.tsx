"use client";

import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import axios from "axios";
import { Sparkles, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AIButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const [isLoading, setIsLoading] = useState(false);

  const handleAIResponse = async (content: string) => {
    const blocks = editor.getSelection()?.blocks ?? []; //Grabs the currently selected blocks (a block is a paragraph, heading, list item, etc.).

    const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(content); //Takes the AI-formatted string (in markdown), converts it into BlockNote-compatible block objects.

    editor.replaceBlocks(blocks, blocksFromMarkdown); // Replaces the old selected blocks with new blocks (AI-improved content)
  };

  const callAI = async () => {
    setIsLoading(true);
    const selectedText = editor.getSelectedText();
    if (!selectedText?.trim()) return;
    try {
      const response = await axios.post("/api/ai/format-text", {
       selectedText
      });
      const data = response.data.message;
      handleAIResponse(data);
    } catch (error) {
      toast.error("Error formatting text");
      console.error("Error fetching AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Components.FormattingToolbar.Button
        mainTooltip={"Format with AI"}
        onClick={callAI}
        isDisabled={isLoading}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <>
            AI <Sparkles className="ml-2 w-4 h-4" />
          </>
        )}
      </Components.FormattingToolbar.Button>
    </>
  );
}
