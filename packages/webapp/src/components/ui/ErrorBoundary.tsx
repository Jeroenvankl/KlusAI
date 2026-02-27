'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-[#EF4444]" />
          </div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-1">Er ging iets mis</h2>
          <p className="text-sm text-[#6B7280] max-w-sm mb-4">
            {this.state.error?.message || 'Een onverwachte fout is opgetreden.'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#4A90D9] text-white hover:bg-[#357ABD] transition-colors active:scale-[0.98]"
          >
            <RotateCcw size={16} />
            Probeer opnieuw
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
