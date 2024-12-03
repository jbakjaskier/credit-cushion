export interface WaiverSection {
  title: string;
  key: string;
  content: string;
}

export interface WaiverSectionTemplate {
  title: string;
  key: string;
}

export interface GeneratedWaiver {
  sections: WaiverSection[];
  metadata: {
    generatedAt: string;
    experienceId: string;
    version: string;
  };
}
