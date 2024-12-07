
"use server"

import ExperiencesStepPanel from "@/components/experiences/ExperiencesStepPanel";

export default async function AddExperiencesLayout({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <section>
            <ExperiencesStepPanel />
            {children}
        </section>
    )
}