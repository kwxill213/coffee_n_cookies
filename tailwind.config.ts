import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        coffee: {
          50: '#f5f0e6',    // Very light cream
          100: '#e6d5c1',   // Light cream
          200: '#d4b991',   // Soft beige
          300: '#c29d6d',   // Warm light brown
          400: '#b08245',   // Medium brown
          500: '#8f6b3e',   // Rich coffee brown
          600: '#6e5230',   // Dark coffee
          700: '#4d3a21',   // Very dark brown
          800: '#2c2216',   // Almost black brown
          900: '#1a130d',   // Deep espresso
        },
        cookie: {
          50: '#fff4e6',    // Very light golden
          100: '#ffe6c5',   // Light golden
          200: '#ffd699',   // Soft golden
          300: '#ffc266',   // Warm golden
          400: '#ffb03b',   // Rich golden
          500: '#cc8d30',   // Dark golden
          600: '#996b24',   // Deep golden brown
          700: '#664619',   // Dark brown
          800: '#332310',   // Very dark brown
          900: '#1a1208',   // Almost black
        },
      },
      fontFamily: {
        'display': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'coffee-texture': 'linear-gradient(to right, rgba(143, 107, 62, 0.05), rgba(143, 107, 62, 0.1))',
        'cookie-texture': 'linear-gradient(to right, rgba(255, 176, 59, 0.05), rgba(255, 176, 59, 0.1))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
