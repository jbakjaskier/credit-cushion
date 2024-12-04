import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            .container {
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
          </style>
        </head>
        <body>
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
        </body>
      </html>
    `;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();

    // Set content and wait for network idle
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=waiver.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
