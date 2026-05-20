import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              type?: 'standard' | 'icon';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type Props = {
  clientId: string;
  onSuccess: (credential: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
};

export default function GoogleSignInButton({
  clientId,
  onSuccess,
  text = 'continue_with',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let attempts = 0;
    const tryInit = () => {
      if (!window.google?.accounts?.id) {
        if (++attempts < 50) {
          window.setTimeout(tryInit, 100);
        }
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) onSuccess(response.credential);
        },
      });
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text,
          logo_alignment: 'center',
          width: 320,
        });
      }
    };
    tryInit();
  }, [clientId, onSuccess, text]);

  return <div ref={containerRef} className="g-signin-button" />;
}
