import React from 'react';

interface AniListErrorBoundaryProps {
  children: React.ReactNode;
}

interface AniListErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AniListErrorBoundary extends React.Component<
  AniListErrorBoundaryProps,
  AniListErrorBoundaryState
> {
  constructor(props: AniListErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here if needed
    // console.error('AniListShowcase error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="layout-column anilist-showcase-container">
          <p className="anilist-title">Anime Listings (AniList GraphQL)</p>
          <div className="anilist-error">
            <p className="error-message">
              {this.state.error?.message || 'Something went wrong.'}
            </p>
            <button className="retry-button" onClick={this.handleRetry}>
              Retry
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default AniListErrorBoundary;

