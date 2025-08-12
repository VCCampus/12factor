export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 'system';
              const root = document.documentElement;
              
              if (theme === 'dark') {
                root.classList.add('dark');
              } else if (theme === 'light') {
                root.classList.remove('dark');
              } else {
                // System preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              }
              
              // Mark theme as ready
              root.setAttribute('data-theme-ready', 'true');
            } catch (e) {
              // If there's an error, still show the content
              document.documentElement.setAttribute('data-theme-ready', 'true');
            }
          })();
        `,
      }}
    />
  );
}