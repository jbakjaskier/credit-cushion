import { NextRequest, NextResponse } from "next/server";
import { generateWaiverHtml } from "@/lib/api/waiver/WaiverHtmlGenerator";
import { Experience } from "@/lib/db/models/Experience";

export async function POST(request: NextRequest) {
  try {
    const { experience } = (await request.json()) as { experience: Experience };

    if (!experience) {
      return NextResponse.json(
        { message: "Experience data is required" },
        { status: 400 }
      );
    }

    // Generate waiver sections
    const waiverSections = generateWaiverHtml(experience);

    // Create HTML content
    const html = `
      <div class="container">
        <header class="header">
          <h1 class="title">${experience.experienceTitle}</h1>
          <h2 class="subtitle">Liability Waiver & Release Form</h2>
          <p>${experience.experienceDescription}</p>
        </header>

        ${waiverSections
          .map(
            (section) => `
          <section class="section">
            <h2 class="section-title">${section.title}</h2>
            <div>${section.content}</div>
          </section>
        `
          )
          .join("")}

        <footer class="footer">
          <div class="signature-grid">
            <div class="signature-block">
              <p class="signature-label">Participant Signature:</p>
              <div class="signature-line"></div>
              <p class="date-label">Date: _____________</p>
            </div>
            <div class="signature-block">
              <p class="signature-label">Provider Signature:</p>
              <div class="signature-line"></div>
              <p class="date-label">Date: _____________</p>
            </div>
          </div>
          <div class="disclaimer">
            <p>This waiver is legally binding. Read carefully before signing.</p>
          </div>
        </footer>
      </div>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { message: "Failed to generate template" },
      { status: 500 }
    );
  }
}
