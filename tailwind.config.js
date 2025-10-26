// tailwind.config.js（ルートに1個だけ）
/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('nativewind/preset')],
    content: [
      './App.{js,jsx,ts,tsx}',
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          card: 'hsl(var(--card))',
          'card-foreground': 'hsl(var(--card-foreground))',
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          primary: 'hsl(var(--primary))',
          'primary-foreground': 'hsl(var(--primary-foreground))',
          secondary: 'hsl(var(--secondary))',
          'secondary-foreground': 'hsl(var(--secondary-foreground))',
          muted: 'hsl(var(--muted))',
          'muted-foreground': 'hsl(var(--muted-foreground))',
        },
      },
    },
    plugins: [],
  };
  