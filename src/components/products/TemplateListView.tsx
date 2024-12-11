"use client";

import { EnvelopeTemplate } from "@/lib/fetcher/template";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/common/Button";
import { Dialog } from "@headlessui/react";
import { CustomerDetailsForm } from "./CustomerDetailsForm";


export default function TemplateListView({
  templates,
  accountId,
}: {
  accountId: string;
  templates: EnvelopeTemplate[];
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<EnvelopeTemplate>(
    templates[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSendEnvelope = () => {
    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Select Credit Contract Template
      </h2>
      <p className="text-base text-gray-700 mb-4">
        Choose the appropriate template for the customer&apos;s credit
        application
      </p>

      {/* Templates grid with scrollable container */}
      <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200">
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.templateId}
              className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                selectedTemplate?.templateId === template.templateId
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start gap-4">
                <DocumentTextIcon
                  className={`h-6 w-6 ${
                    selectedTemplate?.templateId === template.templateId
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex justify-end sticky bottom-0 bg-white py-4 border-t">
      <Button
        onClick={handleSendEnvelope}
        disabled={!selectedTemplate}
        className="min-w-[200px]"
      >
        {selectedTemplate ? "Send envelope to customer" : "Select a template"}
      </Button>
    </div>

    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6">
          <CustomerDetailsForm
            selectedAccountId={accountId}
            selectedTemplateId={selectedTemplate.templateId}
            onCancel={() => setIsModalOpen(false)}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  </>
  )
}
