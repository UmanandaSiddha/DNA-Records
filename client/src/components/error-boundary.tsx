import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(_: Error, __: ErrorInfo) {
        console.error('Error caught in error boundary');

        setTimeout(() => {
            window.location.reload();
        }, 3000);  // Adjust timeout as needed
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div className='flex flex-col justify-center gap-8 items-center mt-8'>
                    <h1 className='text-3xl font-semibold'>Something Went Wrong!!</h1>
                    <p className='text-2xl font-semibold'>Reloading page...</p>
                </div>
            );
        }
        return children;
    }
}

export default ErrorBoundary;
