import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFrame from "../components/site-frame";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Oliver Massaad",
  description:
    "Oliver Massaad — Computer Science & Mathematics student, tech-driven finance, full-stack development, AI projects.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
};

export const viewport = {
  themeColor: "#f7f7f4",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <SiteFrame>{children}</SiteFrame>
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
