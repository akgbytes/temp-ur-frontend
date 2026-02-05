'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                  </div>
                  
                  <h4 className="text-dark mb-3">Oops! Something went wrong</h4>
                  
                  <p className="text-muted mb-4">
                    We're experiencing some technical difficulties. This might be due to high traffic or server issues.
                  </p>
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className="btn btn-custom-primary"
                      onClick={this.handleRetry}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reload Page
                    </button>
                  </div>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4 text-start">
                      <summary className="text-muted small">Error Details (Development)</summary>
                      <pre className="mt-2 small text-muted" style={{ fontSize: '0.75rem' }}>
                        {this.state.error && this.state.error.toString()}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;