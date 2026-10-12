import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-6 border border-red-200 bg-red-50 rounded-lg flex flex-col items-center justify-center gap-2 text-red-800 min-h-[200px]">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h3 className="font-bold text-lg">
            {this.props.sectionName ? `${this.props.sectionName} 加载失败` : "模块加载失败"}
          </h3>
          <p className="text-sm text-red-600 max-w-md text-center">
            {this.state.error?.message || "发生了未知错误"}
          </p>
          <button
            className="mt-2 px-4 py-2 bg-white border border-red-200 rounded text-sm hover:bg-red-50 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
