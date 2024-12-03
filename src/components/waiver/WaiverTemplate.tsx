import { Experience } from "@/lib/db/models/Experience";

interface WaiverTemplateProps {
  experience: Experience;
  sections: {
    title: string;
    key: string;
    content: string;
  }[];
}

export function WaiverTemplate({ experience, sections }: WaiverTemplateProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <header className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2 font-serif">
          {experience.experienceTitle}
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 font-serif">
          Liability Waiver & Release Form
        </h2>
        <p className="text-gray-600">{experience.experienceDescription}</p>
      </header>

      {sections.map((section, index) => (
        <section key={section.key} className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4 pb-2 border-b border-indigo-100 font-serif">
            {section.title}
          </h2>
          <div
            className="prose prose-indigo max-w-none  text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          {index < sections.length - 1 && (
            <hr className="my-6 border-gray-200" />
          )}
        </section>
      ))}

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-4">Participant Signature:</p>
            <div className="h-20 border-b border-gray-300" />
            <p className="text-sm text-gray-600 mt-2">Date: _____________</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-4">Provider Signature:</p>
            <div className="h-20 border-b border-gray-300" />
            <p className="text-sm text-gray-600 mt-2">Date: _____________</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This waiver is legally binding. Read carefully before signing.</p>
        </div>
      </footer>
    </div>
  );
}
