import { Experience } from "@/lib/db/models/Experience";
import { WaiverSection } from "@/lib/types/waiver";
import { generateWaiverHtml } from "./WaiverHtmlGenerator";

export async function generateWaiverSections(experience: Experience) {
  try {
    // TODO: Use AI to generate the waiver sections
    // Use the direct HTML generator instead of AI
    const sections = generateWaiverHtml(experience);
    return sections;
  } catch (error) {
    console.error("Error generating waiver sections:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate waiver sections");
  }
}

export async function generateWaiverContent(
  experience: Experience,
  sections: WaiverSection[]
) {
  try {
    // TODO: Use AI to generate the waiver content
    // Since we're using pre-generated HTML, we can return the sections directly
    return sections;
  } catch (error) {
    console.error("Error generating waiver content:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate waiver content");
  }
}
