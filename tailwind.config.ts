import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        white: {
          1: "#FFFFFF",
          2: "rgba(255, 255, 255, 0.72)",
          3: "rgba(255, 255, 255, 0.4)",
          4: "rgba(255, 255, 255, 0.64)",
          5: "rgba(255, 255, 255, 0.80)",
        },
        black: {
          1: "#15171C",
          2: "#222429",
          3: "#101114",
          4: "#252525",
          5: "#2E3036",
          6: "#24272C",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "nav-focus":
          "linear-gradient(270deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fade: {
          from: {
            opacity: '0%',
          },
          to: {
            opacity: '100%',
          },
        },

        scaleFade: { // 투명한 상태에서 커지면서 나타나는 애니메이션
          from: {
            opacity: '0%',
            transform: 'scale(0.75)',
          },
          to: {
            opacity: '100%',
            transform: 'scale(1)',
          },
        },

        reveal: { // 아래에서 위로 나타나는 애니메이션
          from: {
            opacity: '0%',
            transform: 'translateY(40px)',
          },
          to: {
            opacity: '100%',
            transform: 'translateY(0px)',
          },
        },

        modalReveal: { // 모달창에서 아래에서 위로 커지면서 나타나는 애니메이션
          from: {
            opacity: '0%',
            transform: 'scale(0.7) translateY(100px)',
          },
          to: {
            opacity: '100%',
            transform: 'scale(1) translateY(0px)',
          },
        },

        rotate: { // 회전하면서 아래에서 위로 나타나는 애니메이션
          from: {
            opacity: '0%',
            transform: 'translateY(40px) rotate(6deg)', // 오른쪽으로 6도에서 시작
          },
          to: {
            opacity: '100%',
            transform: 'translateY(0px) rotate(0deg)',
          },
        },

        rotateAlt: { // 회전하면서 아래에서 위로 나타나는 애니메이션
          from: {
            opacity: '0%',
            transform: 'translateY(40px) rotate(-6deg)',
          },
          to: {
            opacity: '100%',
            transform: 'translateY(0px) rotate(0deg)',
          },
        },

        bouncy: { // 위로 튕기면서 나타나는 애니메이션
          to: {
            transform: 'translateY(-8px)',
          },
        },

        bouncyLite: { // 위로 튕기면서 나타나는 애니메이션
          to: {
            transform: 'translateY(-4px)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeXs: 'fade 0.2s forwards',
        fadeSm: 'fade 0.4s forwards',
        fade: 'fade 0.8s forwards',
        fadeMd: 'fade 1.2s forwards',
        fadeLg: 'fade 1.6s forwards',
        fadeXl: 'fade 2s forwards',

        scaleFadeBlog: 'scaleFade 0.8s cubic-bezier(0.2,0,0,1.2) forwards',
        scaleFade: 'scaleFade 0.4s cubic-bezier(0.7,0,0.5,2) forwards',

        revealSm: 'reveal 0.8s cubic-bezier(0.5,-0.2,0.1,1.2) forwards',
        reveal: 'reveal 1.2s cubic-bezier(0.5,-0.2,0.1,1.3) forwards',
        revealMd: 'reveal 1.4s cubic-bezier(0.5,-0.2,0.1,1.4) forwards',
        revealLg: 'reveal 1.6s cubic-bezier(0.5,-0.2,0.1,1.5) forwards',
        modalReveal: 'modalReveal 0.6s cubic-bezier(0,1,0,1.1) forwards',

        rotate: 'rotate 1s cubic-bezier(0.5,-0.5,0.1,1.8) forwards',
        rotateAlt: 'rotateAlt 1s cubic-bezier(0.5,1,0.1,1.8) forwards',

      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config

export default config