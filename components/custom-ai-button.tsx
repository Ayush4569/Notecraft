"use client";

import {
  Block,
  BlockNoteEditor,
  PartialBlock,
} from "@blocknote/core";
import { Components, useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import axios from "axios";
import { Sparkles, Loader } from "lucide-react";
import { useState } from "react";

export function AIButton() {
  const editor:BlockNoteEditor = useBlockNoteEditor();
  const Components:Components = useComponentsContext()!;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAIResponse = async ():Promise<void> => {
    const blocks: Block[] = editor.getSelection()?.blocks ?? [];
    
    const formattedBlocks: PartialBlock[] = await Promise.all(
      blocks.map(async (block): Promise<PartialBlock> => {
        setIsLoading(true);
        if (
          !block.content ||
          !Array.isArray(block.content) ||
          block.content.length === 0
        ) {
          return block;
        }
        const blockContent = block.content[0];
        let selectedText: string;
        if (blockContent.type === "text") {
          if (typeof blockContent.text !== "string" || blockContent.text === "")
            return block;
          selectedText = blockContent.text as string;
        } else if (blockContent.type === "link") {
          if (
            !Array.isArray(blockContent.content) ||
            blockContent.content.length === 0 ||
            typeof blockContent.content[0].text !== "string" ||
            blockContent.content[0].text === ""
          ) {
            return block;
          }
          selectedText = blockContent.content[0].text as string;
        } else return block;

        try {
          const response = await axios.post("/api/ai/format-text", {
            selectedText,
          });
          const formattedText = response.data.message;
          if (blockContent.type == "text") {
            return {
              ...block,
              content: [
                {
                  ...blockContent,
                  text: formattedText,
                },
              ],
            } as PartialBlock;
          } else {
            return {
              ...block,
              content: [
                {
                  ...blockContent,
                  content: [
                    {
                      ...blockContent.content[0],
                      text: formattedText,
                    },
                  ],
                },
              ],
            } as PartialBlock;
          }
        } catch (error) {
          console.error("Error formatting text:", error);
          return block;
        } finally {
          setIsLoading(false);
        }
      })
    );

    editor.replaceBlocks(blocks, formattedBlocks);
  };

  return (
    <>
      <Components.FormattingToolbar.Button
        mainTooltip={"Format with AI"}
        onClick={handleAIResponse}
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
