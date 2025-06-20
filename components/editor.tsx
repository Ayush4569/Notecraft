"use client";
import "@/app/globals.css"
import React, { useEffect, useState } from "react";
import isEqual from "fast-deep-equal"
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import {
  UnnestBlockButton,
  ColorStyleButton,
  FileReplaceButton,
  FileCaptionButton,
  BasicTextStyleButton,
  BlockTypeSelect,
  FormattingToolbarController,
  FormattingToolbar,
  TextAlignButton,
  NestBlockButton,
  CreateLinkButton,
  useCreateBlockNote,
} from "@blocknote/react";
import { AIButton } from "./custom-ai-button";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { Loader } from "lucide-react";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { useTheme } from "next-themes";
import { useDebounce } from "@/hooks/useDebounce";

interface EditorProps {
  docId: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
}

const Editor = ({ docId, initialContent, editable }:EditorProps) => {
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  const { mutate: updateDocument } = useEditDocument();
  const [content, setContent] = useState<PartialBlock[]>(initialContent || []);
  const debouncedValue:string | PartialBlock[] = useDebounce(content, 5000);

  useEffect(() => {
    if (debouncedValue.length === 0) return;  
    if (isEqual(debouncedValue,initialContent))
   {
    return;
   }
    updateDocument({
      docId,
      data: { content: { version: "0.31.2", blocks: content } },
    });
  }, [debouncedValue]);

  const editor:BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? initialContent : undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex-grow overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader size={32} className="animate-spin" />
        </div>
      ) : (
        <article className="mx-auto py-8">
          <BlockNoteView
            formattingToolbar={false}
            editor={editor}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            editable={editable}
            onChange={() => {
              setContent(editor.document);
            }}
          >
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar>
                  <BlockTypeSelect key={"blockTypeSelect"} />
                  {editable && <AIButton key={"aiButton"} />}
                  <FileCaptionButton key={"fileCaptionButton"} />
                  <FileReplaceButton key={"replaceFileButton"} />
                  <BasicTextStyleButton
                    basicTextStyle={"bold"}
                    key={"boldStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"italic"}
                    key={"italicStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"underline"}
                    key={"underlineStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"strike"}
                    key={"strikeStyleButton"}
                  />
                  <BasicTextStyleButton
                    key={"codeStyleButton"}
                    basicTextStyle={"code"}
                  />
                  <TextAlignButton
                    textAlignment={"left"}
                    key={"textAlignLeftButton"}
                  />
                  <TextAlignButton
                    textAlignment={"center"}
                    key={"textAlignCenterButton"}
                  />
                  <TextAlignButton
                    textAlignment={"right"}
                    key={"textAlignRightButton"}
                  />
                  <ColorStyleButton key={"colorStyleButton"} />
                  <NestBlockButton key={"nestBlockButton"} />
                  <UnnestBlockButton key={"unnestBlockButton"} />
                  <CreateLinkButton key={"createLinkButton"} />
                </FormattingToolbar>
              )}
            />
          </BlockNoteView>
        </article>
      )}
    </div>
  );
};

export default Editor;
