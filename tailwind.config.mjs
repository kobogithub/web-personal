/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    container: {
			center: true,
      padding: '1rem',
			screens: {
				xl: '1024px'
			}
		},
		extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%', // add required value here
          }
        }
      },
      colors: {
        magi: {
          bg: 'var(--magi-bg)',
          surface: 'var(--magi-surface)',
          surface2: 'var(--magi-surface-2)',
          ink: 'var(--magi-ink)',
          muted: 'var(--magi-muted)',
          line: 'var(--magi-line)',
          accent: 'var(--magi-accent)',
          'accent-ink': 'var(--magi-accent-ink)',
          violet: 'var(--magi-violet)',
          support: 'var(--magi-support)',
          danger: 'var(--magi-danger)',
        }
      },
      fontFamily: {
        display: ['"Rajdhani"', '"Arial Narrow"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
	},
	plugins: [require('@tailwindcss/typography')],
}
