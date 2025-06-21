"use client";
import "@/app/globals.css";
import React, { useEffect, useState } from "react";
import isEqual from "fast-deep-equal";
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
import { Block, BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { Loader } from "lucide-react";
import { useEditDocument } from "@/hooks/useUpdateDocument";
import { useTheme } from "next-themes";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { toast } from "sonner";

interface EditorProps {
  docId: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
}

const Editor = ({ docId, initialContent, editable }: EditorProps) => {
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [previousImages, setPreviousImages] = useState<Set<string>>(new Set());
  const { mutate: updateDocument } = useEditDocument();
  const [content, setContent] = useState<PartialBlock[]>(initialContent || []);
  const debouncedValue: string | PartialBlock[] = useDebounce(content, 5000);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const { data } = await axios.post("/api/upload/document-image", {
        fileName: file.name,
        fileType: file.type,
        docId,
      });
      if (data.success) {
        const { uploadUrl, key } = data;
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });

        return `/api/view-file?key=${key}`;
      }
    } catch (error) {
      console.log("Error uploading file", error);
      toast.error("Error uploading file");
      return "";
    }
    return "";
  };
  useEffect(() => {
    if (debouncedValue.length === 0) return;
    if (isEqual(debouncedValue, initialContent)) {
      return;
    }
    // updateDocument({
    //   docId,
    //   data: { content: { version: "0.31.2", blocks: content } },
    // });
  }, [debouncedValue]);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? initialContent : undefined,
    uploadFile,
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
              const currentBlocks: Block[] = editor.document;
              console.log("currentBlocks", currentBlocks);
              const extractImageUrls = (blocks: PartialBlock[]): Set<string> => {
                const urls = new Set<string>();
              
                for (const block of blocks) {
                  if (
                    block.type === "image" &&
                    block.props &&
                    typeof block.props === "object" &&
                    "url" in block.props &&
                    typeof block.props.url === "string"
                  ) {
                    urls.add(block.props.url);
                  }
                }
              
                return urls;
              };
              const currentImages:Set<string> = extractImageUrls(currentBlocks);

              const removedImages: string[] = [...previousImages].filter(
                (image) => !currentImages.has(image)
              );
              removedImages.forEach(async (url) => {
                try {
                  await axios.delete(
                    `/api/delete-file?url=${encodeURIComponent(url)}`
                  );
                } catch (err) {
                  console.error("Failed to delete image:", url, err);
                }
              });
              setPreviousImages(currentImages);
              setContent(currentBlocks);
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
