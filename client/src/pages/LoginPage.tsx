import { useCallback, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { api } from '../api/client';
import useAuthStore, { AuthUser } from '../stores/authStore';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './LoginPage.scss';

type Mode = 'login' | 'register';

type AuthResponse = { user: AuthUser; token: string };

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

function describeError(err: unknown): string {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const setSession = useAuthStore((s) => s.setSession);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (submitting) return;
      setError(null);
      setSubmitting(true);
      try {
        const path = mode === 'register' ? '/auth/register' : '/auth/login';
        const body =
          mode === 'register' ? { email, password, name } : { email, password };
        const { data } = await api.post<AuthResponse>(path, body);
        setSession(data.user, data.token);
        toast.success(
          mode === 'register' ? 'Welcome to Foody!' : 'Welcome back!',
        );
      } catch (err) {
        setError(describeError(err));
      } finally {
        setSubmitting(false);
      }
    },
    [mode, email, password, name, submitting, setSession],
  );

  const handleGoogleSuccess = useCallback(
    async (credential: string) => {
      setError(null);
      setSubmitting(true);
      try {
        const { data } = await api.post<AuthResponse>('/auth/google', {
          idToken: credential,
        });
        setSession(data.user, data.token);
        toast.success(`Welcome, ${data.user.name ?? data.user.email}!`);
      } catch (err) {
        setError(describeError(err));
      } finally {
        setSubmitting(false);
      }
    },
    [setSession],
  );

  return (
    <div className="auth-shell">
      <div className="orb orb-lime" aria-hidden />
      <div className="orb orb-cyan" aria-hidden />
      <div className="orb orb-violet" aria-hidden />
      <div className="shell-vignette" aria-hidden />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0.32, 0.99] }}
      >
        <div className="auth-brand">
          <span className="brand-dot" aria-hidden />
          <span>Snack</span>
          <span className="brand-sep">·</span>
          <span className="brand-sub">Diary</span>
        </div>

        <div className="auth-heading">
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to your snack diary.'
              : 'Start tracking your snacks in seconds.'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Create account
          </button>
        </div>

        <Form className="auth-form" onSubmit={handleEmailSubmit}>
          {mode === 'register' && (
            <Form.Group className="field">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Form.Group>
          )}

          <Form.Group className="field">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="field">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              minLength={mode === 'register' ? 8 : undefined}
              placeholder={
                mode === 'register' ? 'At least 8 characters' : 'Your password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
            />
          </Form.Group>

          {error && <div className="field-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            className="submit-btn"
            disabled={submitting || !email || !password}
          >
            {submitting
              ? 'Please wait…'
              : mode === 'register'
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </Form>

        {googleClientId && (
          <>
            <div className="auth-divider">or</div>
            <div className="auth-google">
              <GoogleSignInButton
                clientId={googleClientId}
                onSuccess={handleGoogleSuccess}
                text={mode === 'register' ? 'signup_with' : 'continue_with'}
              />
            </div>
          </>
        )}

        <div className="auth-footer">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('register');
                }}
              >
                Create one
              </a>
            </>
          ) : (
            <>
              Already have one?{' '}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('login');
                }}
              >
                Sign in
              </a>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
