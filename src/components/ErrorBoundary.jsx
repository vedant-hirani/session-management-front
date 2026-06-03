import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[v0] Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something Went Wrong</h1>
            <p style={styles.message}>
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>
            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.button}>
                Try Again
              </button>
              <a href="/" style={styles.link}>
                <button style={{...styles.button, backgroundColor: '#6b7280'}}>
                  Go Home
                </button>
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '1rem',
  },
  content: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '3rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    maxWidth: '400px',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    color: '#1f2937',
  },
  message: {
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  link: {
    textDecoration: 'none',
  },
}
