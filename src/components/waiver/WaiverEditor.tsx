"use client";

import { useCallback, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Experience } from "@/lib/db/models/Experience";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface WaiverEditorProps {
  experience: Experience;
}

export function WaiverEditor({ experience }: WaiverEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/waiver/generate-template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experience }),
        });

        if (!response.ok) throw new Error("Failed to load template");
        const html = await response.text();
        setContent(html);
      } catch (err) {
        console.error("Error loading template:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load template"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [experience]);

  const handleSave = useCallback(async () => {
    try {
      const response = await fetch("/api/waiver/save-waiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: experience.experienceId,
          content,
        }),
      });

      if (!response.ok) throw new Error("Failed to save waiver");

      toast.success("Waiver saved successfully");
      router.push(`/experiences/publish-waiver/${experience.experienceId}`);
    } catch (err) {
      console.error("Error saving waiver:", err);
      toast.error("Failed to save waiver");
    }
  }, [content, experience.experienceId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        init={{
          height: 800,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: `
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 794px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              margin-bottom: 2rem;
            }

            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }

            .subtitle {
              font-size: 18px;
              color: #4a5568;
              margin-bottom: 1rem;
            }

            .section {
              margin-bottom: 2rem;
            }

            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 1rem;
            }

            .footer {
              margin-top: 3rem;
              padding-top: 2rem;
              border-top: 1px solid #e5e7eb;
            }

            .signature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
            }

            .signature-block {
              margin-bottom: 2rem;
            }

            .signature-label {
              font-size: 14px;
              color: #4b5563;
              margin-bottom: 1rem;
            }

            .signature-line {
              height: 5rem;
              border-bottom: 1px solid #d1d5db;
            }

            .date-label {
              font-size: 14px;
              color: #4b5563;
              margin-top: 0.5rem;
            }

            .disclaimer {
              margin-top: 2rem;
              text-align: center;
              font-size: 14px;
              color: #6b7280;
            }
          `,
          directionality: "ltr",
        }}
        onEditorChange={(newContent) => {
          setContent(newContent);
        }}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave}>Continue to Publish</Button>
      </div>
    </div>
  );
}
