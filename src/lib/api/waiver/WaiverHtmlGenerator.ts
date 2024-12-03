import { Experience } from "@/lib/db/models/Experience";
import { WaiverSection } from "@/lib/types/waiver";

export function generateWaiverHtml(experience: Experience): WaiverSection[] {
  // Generate static sections with pre-defined content
  return [
    {
      key: "provider-details",
      title: "Provider Details",
      content: `
        <div class="mb-6">
          <p class="mb-2"><strong>Company Name:</strong> ${experience.experienceTitle}</p>
          <p class="mb-2"><strong>Location:</strong> ${experience.experienceLocation.addressLine}</p>
          <p class="mb-2"><strong>Contact Information:</strong> [Provider Contact Details]</p>
        </div>
      `,
    },
    {
      key: "participant-info",
      title: "Participant Information",
      content: `
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="font-medium mb-1">Full Name:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
            <div>
              <p class="font-medium mb-1">Date of Birth:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-medium mb-1">Address:</p>
            <div class="h-8 border-b border-gray-300"></div>
          </div>
        </div>
      `,
    },
    {
      key: "experience-description",
      title: "Experience Description",
      content: `
        <div class="mb-6">
          <p class="mb-4">${experience.experienceDescription}</p>
          <p class="mb-4">${experience.experienceExtendedDescription || ""}</p>
        </div>
      `,
    },
    {
      key: "risks",
      title: "Risks and Acknowledgments",
      content: `
        <div class="mb-6">
          <p class="mb-4">I understand and acknowledge that participating in ${experience.experienceTitle} involves inherent risks, including but not limited to:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Physical injury</li>
            <li>Equipment failure</li>
            <li>Weather conditions</li>
            <li>Actions of other participants</li>
          </ul>
          <p>I voluntarily accept and assume all such risks, both known and unknown.</p>
        </div>
      `,
    },
    {
      key: "terms",
      title: "Terms and Conditions",
      content: `
        <div class="mb-6">
          <p class="mb-4">By signing this waiver, I agree to:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Follow all safety instructions and guidelines</li>
            <li>Use provided safety equipment properly</li>
            <li>Report any injuries or incidents immediately</li>
            <li>Not participate while under the influence of drugs or alcohol</li>
          </ul>
        </div>
      `,
    },
    {
      key: "medical",
      title: "Medical Disclosure",
      content: `
        <div class="mb-6">
          <p class="mb-4">Please disclose any medical conditions that may affect your participation:</p>
          <div class="h-24 border border-gray-300 rounded-md mb-4"></div>
          <p class="text-sm text-gray-600">Include allergies, medications, and recent injuries/surgeries</p>
        </div>
      `,
    },
    {
      key: "media",
      title: "Media Release",
      content: `
        <div class="mb-6">
          <p class="mb-4">I grant permission for photos and videos taken during the activity to be used for:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Marketing materials</li>
            <li>Social media</li>
            <li>Website content</li>
            <li>Promotional purposes</li>
          </ul>
        </div>
      `,
    },
    {
      key: "emergency",
      title: "Emergency Contact",
      content: `
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-medium mb-1">Emergency Contact Name:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
            <div>
              <p class="font-medium mb-1">Relationship:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
            <div>
              <p class="font-medium mb-1">Phone Number:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
            <div>
              <p class="font-medium mb-1">Alternative Phone:</p>
              <div class="h-8 border-b border-gray-300"></div>
            </div>
          </div>
        </div>
      `,
    },
  ];
}
