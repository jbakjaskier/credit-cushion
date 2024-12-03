export type StepStatus = "complete" | "current" | "upcoming";

export type StepDefinition = {
  displayId: string;
  name: string;
  description: string;
  status: StepStatus;
};
