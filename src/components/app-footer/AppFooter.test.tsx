import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppFooter } from './AppFooter';

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('AppFooter', () => {
  it('renders footer element', () => {
    render(<AppFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders theme toggle buttons', () => {
    render(<AppFooter />);

    expect(screen.getByLabelText('Light theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark theme')).toBeInTheDocument();
    expect(screen.getByLabelText('System theme')).toBeInTheDocument();
  });

  it('renders logo placeholder', () => {
    render(<AppFooter />);

    const logoPlaceholder = screen.getByText('H');
    expect(logoPlaceholder).toBeInTheDocument();
  });
});
