import { Globe, Upload, FileText, Lock } from "lucide-react";

export const stepIcons = {
  provider: Globe,
  upload: Upload,
  review: FileText,
  docusign: Lock,
};

export type StepIconType = keyof typeof stepIcons;
