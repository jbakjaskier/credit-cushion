import { Experience } from "@/lib/db/models/Experience";
import { WaiverSection } from "@/lib/types/waiver";

export function generateWaiverHtml(experience: Experience): WaiverSection[] {
  // Generate static sections with pre-defined content
  return [
    {
      key: "provider-details",
      title: "Provider Details",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 0.5rem;"><strong>Company Name:</strong> ${experience.experienceTitle}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${experience.experienceLocation.addressLine}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Contact Information:</strong> [Provider Contact Details]</p>
        </div>
      `,
    },
    {
      key: "participant-info",
      title: "Participant Information",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <p style="font-weight: 500; margin-bottom: 0.25rem;">Full Name:</p>
              <div style="height: 2rem; border-bottom: 1px solid #d1d5db;"></div>
            </div>
            <div>
              <p style="font-weight: 500; margin-bottom: 0.25rem;">Date of Birth:</p>
              <div style="height: 2rem; border-bottom: 1px solid #d1d5db;"></div>
            </div>
          </div>
          <div style="margin-bottom: 1rem;">
            <p style="font-weight: 500; margin-bottom: 0.25rem;">Address:</p>
            <div style="height: 2rem; border-bottom: 1px solid #d1d5db;"></div>
          </div>
        </div>
      `,
    },
    {
      key: "acknowledgment",
      title: "Acknowledgment of Risks",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 1rem;">
            I understand and acknowledge that participation in ${experience.experienceTitle} involves inherent risks, including but not limited to:
          </p>
          <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
            <li style="margin-bottom: 0.5rem;">Physical injury or strain</li>
            <li style="margin-bottom: 0.5rem;">Equipment failure or misuse</li>
            <li style="margin-bottom: 0.5rem;">Environmental hazards</li>
            <li style="margin-bottom: 0.5rem;">Actions of other participants</li>
          </ul>
          <p style="margin-bottom: 1rem;">
            I voluntarily agree to assume all risks and accept sole responsibility for any injury, damage, or loss that may result from my participation.
          </p>
        </div>
      `,
    },
    {
      key: "release",
      title: "Release of Liability",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 1rem;">
            In consideration of being permitted to participate in ${experience.experienceTitle}, I hereby agree to release and discharge from liability arising from negligence the provider and its owners, directors, officers, employees, agents, volunteers, participants, and all other persons or entities acting for them (hereinafter collectively referred to as "Releasees"), on behalf of myself and my children, parents, heirs, assigns, personal representative and estate.
          </p>
          <p style="margin-bottom: 1rem;">
            I agree to indemnify and hold harmless Releasees against any and all claims, suits, or actions of any kind whatsoever for liability, damages, compensation, or otherwise brought by me or anyone on my behalf, including attorney's fees and any related costs.
          </p>
        </div>
      `,
    },
    {
      key: "medical",
      title: "Medical Authorization",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 1rem;">
            I hereby authorize the provider to secure such medical advice and services as may be deemed necessary for my health and safety. I agree to accept financial responsibility for any medical expenses incurred.
          </p>
          <div style="margin-top: 1rem;">
            <p style="font-weight: 500; margin-bottom: 0.25rem;">Emergency Contact:</p>
            <div style="height: 2rem; border-bottom: 1px solid #d1d5db;"></div>
            <p style="font-weight: 500; margin-bottom: 0.25rem; margin-top: 1rem;">Emergency Phone:</p>
            <div style="height: 2rem; border-bottom: 1px solid #d1d5db;"></div>
          </div>
        </div>
      `,
    },
    {
      key: "media",
      title: "Media Release",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="margin-bottom: 1rem;">
            I grant permission to ${experience.experienceTitle} to use photographs, video, and/or audio recordings of me taken during the activity for promotional purposes without expectation of compensation.
          </p>
          <div style="margin-top: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="checkbox" style="width: 1rem; height: 1rem;">
              <span style="font-size: 0.875rem; color: #4b5563;">I agree to the media release terms</span>
            </label>
          </div>
        </div>
      `,
    },
  ];
}
