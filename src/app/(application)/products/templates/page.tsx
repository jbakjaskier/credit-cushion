"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Button from "@/components/common/Button";
import { CustomerDetailsForm } from "@/components/products/CustomerDetailsForm";

const mockTemplates = [
  {
    id: 1,
    name: "New Credit Application",
    description: "Standard credit application template for new customers",
  },
  {
    id: 2,
    name: "Credit Limit Increase",
    description:
      "Application for existing customers requesting increased credit",
  },
  {
    id: 3,
    name: "Business Credit Application",
    description:
      "Credit application template specifically for business entities",
  },
  {
    id: 4,
    name: "Joint Credit Application",
    description:
      "Template for joint credit applications with multiple applicants",
  },
  {
    id: 5,
    name: "Secured Credit Application",
    description:
      "Application template for secured credit products with collateral",
  },
  {
    id: 6,
    name: "Student Credit Application",
    description: "Specialized template for student credit products",
  },
  {
    id: 7,
    name: "Home Equity Line",
    description: "Application for home equity line of credit (HELOC)",
  },
  {
    id: 8,
    name: "Auto Loan Application",
    description: "Template for vehicle financing applications",
  },
  {
    id: 9,
    name: "Credit Card Balance Transfer",
    description: "Request form for transferring balances from other cards",
  },
  {
    id: 10,
    name: "Personal Line of Credit",
    description: "Application for unsecured personal line of credit",
  },
  {
    id: 11,
    name: "Small Business Loan",
    description: "Application template for small business financing",
  },
  {
    id: 12,
    name: "Equipment Financing",
    description: "Template for business equipment financing requests",
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof mockTemplates)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: get providerId from search params and fetch provider docusign templates
  // const searchParams = useSearchParams();
  // const providerId = searchParams.get("provider");
  // Filter templates based on search

  const filteredTemplates = mockTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendEnvelope = () => {
    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Select Credit Contract Template
        </h2>
        <p className="text-base text-gray-700 mb-4">
          Choose the appropriate template for the customer&apos;s credit
          application
        </p>

        {/* Search input for templates */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-base sm:leading-6"
          />
        </div>

        {/* Templates grid with scrollable container */}
        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200">
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-2 py-8">
                <p className="text-center text-gray-500">
                  No templates match your search criteria
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start gap-4">
                    <DocumentTextIcon
                      className={`h-6 w-6 ${
                        selectedTemplate?.id === template.id
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
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
              onSubmit={(data) => {
                // TODO: Call the actual onSubmit handler
                console.log("Submit with data:", {
                  template: selectedTemplate,
                  customer: data,
                });
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
