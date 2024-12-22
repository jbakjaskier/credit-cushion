"use client";

import { useState } from "react";
import Button from "../common/Button";
import ProgressLoader from "../common/ProgressLoader";
import { createPersonalLoanEnvelopeTemplate } from "@/lib/fetcher/template";
import { isFetcherError } from "@/lib/fetcher/common";
import { addLoanTemplate } from "@/lib/db/dbFetcher";
import { createConnectConfigurationForAccount } from "@/lib/fetcher/connect";

export default function TemplateLoader({
  isLoadedInDocusign,
}: {
  isLoadedInDocusign: boolean;
}) {
  const [state, setState] = useState<
    | {
        mode: "initial";
        isLoadedInDocusign: boolean;
      }
    | {
        mode: "loading";
      }
    | {
        mode: "success";
      }
    | {
        mode: "error";
        errorMessage: string;
      }
  >({
    mode: "initial",
    isLoadedInDocusign: isLoadedInDocusign,
  });

  async function onLoadClick() {
    setState({
      mode: "loading",
    });
    const docusignLoadResult = await createPersonalLoanEnvelopeTemplate();

    if (isFetcherError(docusignLoadResult)) {
      setState({
        mode: "error",
        errorMessage: docusignLoadResult.errorMessage,
      });
    } else {
      const connectConfigurationResult =
        await createConnectConfigurationForAccount();

      if (isFetcherError(connectConfigurationResult)) {
        setState({
          mode: "error",
          errorMessage: connectConfigurationResult.errorMessage,
        });
      } else {
        //load it in Db as well
        const templateWriteResult = await addLoanTemplate({
          templateName: docusignLoadResult.name,
          _id: docusignLoadResult.templateId,
          templateUri: docusignLoadResult.uri,
        });

        if (templateWriteResult.mode === "success") {
          setState({
            mode: "success",
          });
        } else {
          setState({
            mode: "error",
            errorMessage: templateWriteResult.errorMessage,
          });
        }
      }
    }
  }

  return (
    <div className="mt-8">
      {((state.mode === "initial" && !state.isLoadedInDocusign) ||
        state.mode === "error") && (
        <Button className="mt-2 mb-2" onClick={onLoadClick}>
          Load it in DocuSign
        </Button>
      )}

      {(state.mode === "success" ||
        (state.mode === "initial" && state.isLoadedInDocusign)) && (
        <p className="mt-2 mb-2 text-sm text-gray-500">
          This template has been loaded in DocuSign 🎉
        </p>
      )}

      {state.mode === "loading" && <ProgressLoader />}

      {state.mode === "error" && (
        <p className="text-sm text-red-500">{state.errorMessage}</p>
      )}
    </div>
  );
}
