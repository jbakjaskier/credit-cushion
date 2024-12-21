"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import Button from "../common/Button";
import ProgressLoader from "../common/ProgressLoader";
import {
  addEnvelopeToHardship,
  updateVariationofContractContent,
} from "@/lib/db/dbFetcher";
import { sendVariationOfContractToCustomer } from "@/lib/fetcher/envelope";
import { isFetcherError } from "@/lib/fetcher/common";
import { isDbWriteOperationErrorResult } from "@/lib/db/models/loans";

export default function VariationOfContractEditor({
  generatedContent,
  loanId,
}: {
  loanId: string;
  generatedContent: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const [state, setState] = useState<
    | {
        mode: "loading";
      }
    | {
        mode: "initial";
      }
    | {
        mode: "error";
        errorMessage: string;
      }
    | {
        mode: "success";
      }
  >({
    mode: "initial",
  });

  const onSendToCustomer = async () => {
    if (editorRef.current) {
      setState({
        mode: "loading",
      });
      // Access the editor instance through the getContent method
      const content = editorRef.current.getContent();

      const contentWrappedInHtml = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Variation of Loan</title>
                <style>
                    @media print {
                        html, body {
                            width: 100%;
                            margin: 0;
                            box-sizing: border-box;
                        }
                    }

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        width: 210mm; /* A4 width */
                        max-width: 794px; /* Pixel equivalent of A4 width */
                    }

                    header {
                        width: 100%;
                        background-color: #ffffff;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .header-banner {
                        width: 210mm; /* A4 width */
                        max-width: 794px; /* Pixel equivalent of A4 width */
                        height: auto;
                        max-height: 300px;
                        object-fit: cover;
                        display: block;
                    }

                    main {
                        padding: 2rem;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    h1 {
                        color: #333;
                        margin-bottom: 1.5rem;
                        text-align: center;
                    }

                    .content {
                        background-color: #f9f9f9;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        margin-bottom: 2rem;
                    }

                    .signature-block {
                        margin-top: 3rem;
                    }

                    .signature-line {
                        border-bottom: 2px solid #000;
                        width: 100%;
                        height: 100px;
                        margin-bottom: 0.5rem;
                    }

                    .date-line {
                        border-bottom: 2px solid #000;
                        width: 50%;
                        height: 30px;
                        margin-top: 1rem;
                    }

                    .label {
                        font-size: 0.9rem;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                ${content}
                </body>
                </html>
                `;

      const updateResult = await updateVariationofContractContent(
        loanId,
        contentWrappedInHtml
      );
      if (isDbWriteOperationErrorResult(updateResult)) {
        setState({
          mode: "error",
          errorMessage: updateResult.errorMessage,
        });
      } else {
        //Send to Customer
        const envelopCreatedCustomer = await sendVariationOfContractToCustomer(
          loanId
        );

        if (!isFetcherError(envelopCreatedCustomer)) {
          const result = await addEnvelopeToHardship(
            loanId,
            envelopCreatedCustomer
          );

          if (isDbWriteOperationErrorResult(result)) {
            setState({
              mode: "error",
              errorMessage: result.errorMessage,
            });
          } else {
            setState({
              mode: "success",
            });
          }
        } else {
          setState({
            mode: "error",
            errorMessage: envelopCreatedCustomer.errorMessage,
          });
        }
      }
    }
  };

  return (
    <div>
      {(state.mode === "initial" ||
        state.mode === "error" ||
        state.mode === "loading") && (
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)} // Set the editor instance
          apiKey="obtsruyl7062su88vo5loyt3lvdw86v8bhrcqn6nyk7dngri"
          init={{
            plugins: [
              // Core editing features
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
          }}
          initialValue={generatedContent}
        />
      )}

      <div className="flex justify-end mt-4">
        {state.mode === "loading" ? (
          <ProgressLoader />
        ) : (state.mode === "initial" || state.mode === "error") ? (
          <Button onClick={onSendToCustomer}>Send to Customer</Button>
        ) : null}

        {
          state.mode === "error" && <p className="mt-4 text-sm text-red-600">{state.errorMessage}</p>
        }
      </div>

      {
        state.mode === "success" && (
          <p className="text-sm">{`We have successfully sent the variation of contract to the customer 🎉✨`}</p>
        )
      }

    </div>
  );
}
