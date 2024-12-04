"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WaiverErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PDF Error:", error);
    console.error("Error Info:", errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          <h2>Sorry, there was a problem loading the PDF.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WaiverErrorBoundary;
