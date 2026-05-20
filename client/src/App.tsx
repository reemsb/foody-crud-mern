import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SnackList from './components/SnackList';
import LoginPage from './pages/LoginPage';
import useAuthStore from './stores/authStore';
import { api } from './api/client';
import './App.scss';

function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initial = (user.name || user.email).charAt(0).toUpperCase();
  const label = user.name || user.email.split('@')[0];

  return (
    <div className="user-menu">
      <button
        type="button"
        className="user-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="user-avatar" />
        ) : (
          <span className="user-avatar user-initial">{initial}</span>
        )}
        <span className="user-name">{label}</span>
        <i className="bi bi-chevron-down user-caret" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="user-menu-backdrop" onClick={() => setOpen(false)} />
            <motion.div
              className="user-menu-dropdown"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="user-menu-info">
                <div className="user-menu-name">{user.name ?? '—'}</div>
                <div className="user-menu-email">{user.email}</div>
              </div>
              <button
                type="button"
                className="user-menu-item"
                onClick={() => {
                  clear();
                  toast.info('Signed out');
                }}
              >
                <i className="bi bi-box-arrow-right" aria-hidden />
                <span>Sign out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainApp() {
  return (
    <div className="App">
      <header className="top-bar">
        <div className="top-bar-inner">
          <a href="/" className="brand">
            <span className="brand-dot" aria-hidden />
            <span>Snack</span>
            <span className="brand-sep">·</span>
            <span className="brand-sub">Diary</span>
          </a>
          <UserMenu />
        </div>
      </header>

      <main className="page-content">
        <SnackList />
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Rim Sboui</span>
        <span className="footer-sep">·</span>
        <a
          href="https://github.com/reemsb"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="GitHub profile"
        >
          <i className="bi bi-github" aria-hidden />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
}

function AppShell() {
  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (status !== 'loading' || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) clear();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, token, setUser, clear]);

  if (status === 'loading') {
    return (
      <div className="boot-screen">
        <div className="boot-dot" />
      </div>
    );
  }

  return status === 'authed' ? <MainApp /> : <LoginPage />;
}

function App() {
  return (
    <>
      <AppShell />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
