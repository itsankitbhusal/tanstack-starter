import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorPage } from './ErrorPage';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

describe('ErrorPage', () => {
  it('should render 404 error by default', () => {
    render(<ErrorPage />);
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render 403 error', () => {
    render(<ErrorPage errorCode={403} />);
    
    expect(screen.getByText('Forbidden Access')).toBeInTheDocument();
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('should render 500 error', () => {
    render(<ErrorPage errorCode={500} />);
    
    expect(screen.getByText('Server Error')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should render network error', () => {
    render(<ErrorPage errorCode="network" />);
    
    expect(screen.getByText('Connection Lost')).toBeInTheDocument();
  });

  it('should render custom title and description', () => {
    render(
      <ErrorPage 
        errorCode={404} 
        title="Custom Title" 
        description="Custom Description" 
      />,
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('should render Go Back button', () => {
    render(<ErrorPage />);
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should render Log In button when not authenticated', () => {
    render(<ErrorPage />);
    
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
});
