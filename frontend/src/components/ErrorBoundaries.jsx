import { Component } from "react";

// Optional: Error logging function
function logErrorToMyService(error, errorInfo) {
  console.error("Error:", error);
  console.error("Error Info:", errorInfo);
  // Example: Send the error to an analytics or logging service
  // fetch('/log-error', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
}

export class ErrorBoundaries extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details (replace with your service if needed)
    logErrorToMyService(error, errorInfo);

    // Store error message in state for debugging (optional)
    this.setState({ errorMessage: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      // Development: Show detailed error (replace with user-friendly message in production)
      return (
        <div>
          <h1>Something went wrong!</h1>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children; // Render child components
  }
}
