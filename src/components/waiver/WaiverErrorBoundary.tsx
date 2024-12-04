"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Button from "@/components/common/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WaiverErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Waiver generation error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Generating Waiver
          </h2>
          <p className="text-gray-600 mb-6">
            {this.state.error?.message ||
              "An unexpected error occurred while generating your waiver"}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
