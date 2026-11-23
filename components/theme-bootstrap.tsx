'use client'

import { useServerInsertedHTML } from 'next/navigation'

/**
 * Injects the theme bootstrap script OUTSIDE the React tree.
 *
 * React 19 warns about any <script> rendered inside a component, even on
 * the server. useServerInsertedHTML writes the tag directly into the SSR
 * HTML stream, so React never sees it during client rendering.
 *
 * The script still runs synchronously before hydration and before the
 * first paint — the warning is the only thing that changes.
 */
export function ThemeBootstrap() {
  useServerInsertedHTML(() => {
    const script = `
(function(){
  var root = document.documentElement;
  try {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    var isDark;
    if (saved === 'dark') isDark = true;
    else if (saved === 'light') isDark = false;
    else {
      try { isDark = window.matchMedia('(prefers-color-scheme: dark)').matches; }
      catch(e) { isDark = false; }
    }
    root.classList.toggle('dark', isDark);
  } catch(e) {}
  root.classList.add('is-loading');
})();
    `.trim()

    return (
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: script }}
      />
    )
  })

  return null
}