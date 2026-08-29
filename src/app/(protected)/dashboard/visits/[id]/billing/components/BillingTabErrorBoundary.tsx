'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; tabName: string };
type State = { hasError: boolean };

export default class BillingTabErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Billing ${this.props.tabName} tab failed to render`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          This section could not be displayed. Other billing sections remain available.
        </div>
      );
    }

    return this.props.children;
  }
}
