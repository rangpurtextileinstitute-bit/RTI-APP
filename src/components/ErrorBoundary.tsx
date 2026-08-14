import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
          <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong.</h1>
            <p className="text-slate-600">We're experiencing technical difficulties. Please refresh the page or try again later.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
