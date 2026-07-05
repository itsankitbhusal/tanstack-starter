import { useNavigate } from '@tanstack/react-router';
import {
  ShieldAlert,
  SearchX,
  ArrowLeft,
  Home,
  LogOut,
  AlertTriangle,
  WifiOff,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

type ErrorType = 403 | 404 | 500 | 'network';

interface ErrorPageProps {
  errorCode?: ErrorType;
  title?: string;
  description?: string;
}

const errorConfig: Record<
  ErrorType,
  {
    icon: typeof ShieldAlert;
    defaultTitle: string;
    defaultDescription: string;
    helperText: string;
  }
> = {
  403: {
    icon: ShieldAlert,
    defaultTitle: 'Forbidden Access',
    defaultDescription:
      "You don't have permission to view this section, or your session may have expired.",
    helperText: 'If you think this is a mistake, contact your administrator or try logging in again.',
  },
  404: {
    icon: SearchX,
    defaultTitle: 'Page Not Found',
    defaultDescription:
      "The page you're looking for doesn't exist or has been moved.",
    helperText: 'Try checking the URL or navigating through the menu.',
  },
  500: {
    icon: AlertTriangle,
    defaultTitle: 'Server Error',
    defaultDescription:
      'Something went wrong on our end. Please try again later.',
    helperText: 'If the problem persists, contact your administrator.',
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'Connection Lost',
    defaultDescription:
      'Unable to reach the server. Check your internet connection and try again.',
    helperText: "Make sure you're connected to the internet and try again.",
  },
};

export function ErrorPage({
  errorCode = 404,
  title,
  description,
}: ErrorPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const errorType: ErrorType =
    errorCode && errorCode in errorConfig ? errorCode : 404;
  const config = errorConfig[errorType];
  const IconComponent = config.icon;

  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  const handleGoHome = () => {
    navigate({ to: '/dashboard' });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const handleLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl transform scale-150 opacity-50"></div>
        <div className="relative rounded-full bg-background p-8 shadow-lg border border-border group">
          <IconComponent className="w-14 h-14 text-primary group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="max-w-md space-y-4">
        {typeof errorCode === 'number' && (
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-2">
            {errorCode}
          </h1>
        )}
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {displayTitle}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {displayDescription}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center gap-2 px-6 py-2.5 border border-border rounded-xl font-semibold text-foreground hover:bg-accent transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        {isAuthenticated ? (
          <>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Home size={18} />
              Go Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border border-destructive text-destructive rounded-xl font-semibold hover:bg-red-50 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <LogOut size={18} />
            Log In
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">{config.helperText}</p>
    </div>
  );
}

export default ErrorPage;
