import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Button from "@/components/ToggleThemeBtn";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
      <Button />
    </ThemeProvider>
  );
}
