import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              We encountered an unexpected display issue while loading this page. Please try refreshing or returning to the home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="btn-secondary text-sm py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
