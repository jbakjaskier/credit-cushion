"use client";

import { useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import { useState } from "react";
import MailAnimation from "@/components/common/MailAnimation";
import { ButtonSpinner } from "@/components/common/ButtonSpinner";

export type CustomerDetails = {
  legalName: string;
  email: string;
  phone: string;
  address: string;
};

export function CustomerDetailsForm({
  selectedAccountId,
  selectedTemplateId,
  onCancel,
}: {
  selectedAccountId: string;
  selectedTemplateId: string;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<CustomerDetails>({
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: CustomerDetails) => {
    setIsSubmitting(true);

    // const submitFormResult = await sendEnvelopeToCustomer(
    //   selectedAccountId,
    //   selectedTemplateId,
    //   data
    // );

    // if (isFetcherError(submitFormResult)) {
    //   setIsSuccess(false);
    // } else {
      
    // }

    setIsSuccess(true);

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <MailAnimation />
        <h3 className="text-lg font-semibold text-gray-900 mt-4">
          Contract Sent Successfully!
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          The contract will be mailed to the customer shortly. You will be
          notified of further correspondence under the notifications section.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Customer Details
        </h2>
        <p className="text-base text-gray-700">
          Please provide the customer&apos;s information to send the document
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="legalName"
            className="block text-base font-semibold text-gray-900 mb-1"
          >
            Legal Name
            <span className="text-red-600 ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="legalName"
            {...register("legalName", {
              required: "Legal name is required",
              validate: (value) =>
                value.trim() !== "" || "Legal name cannot be empty",
            })}
            className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
              ${
                errors.legalName
                  ? "ring-red-300 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-indigo-600"
              }
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-base sm:leading-6`}
            placeholder="Enter legal name"
          />
          {touchedFields.legalName && errors.legalName && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.legalName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-base font-semibold text-gray-900 mb-1"
          >
            Email
            <span className="text-red-600 ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
              ${
                errors.email
                  ? "ring-red-300 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-indigo-600"
              }
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-base sm:leading-6`}
            placeholder="Enter email address"
          />
          {touchedFields.email && errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-base font-semibold text-gray-900 mb-1"
          >
            Phone Number
            <span className="text-red-600 ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="tel"
            id="phone"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?[\d\s-]+$/,
                message: "Invalid phone number",
              },
            })}
            className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
              ${
                errors.phone
                  ? "ring-red-300 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-indigo-600"
              }
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-base sm:leading-6`}
            placeholder="Enter phone number"
          />
          {touchedFields.phone && errors.phone && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-base font-semibold text-gray-900 mb-1"
          >
            Address
            <span className="text-red-600 ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="address"
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address", { required: "Address is required" })}
            rows={3}
            className={`block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset 
              ${
                errors.address
                  ? "ring-red-300 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-indigo-600"
              }
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-base sm:leading-6`}
            placeholder="Enter full address"
          />
          {touchedFields.address && errors.address && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0 || isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <ButtonSpinner />
              <span>Sending...</span>
            </>
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </form>
  );
}
