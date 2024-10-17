import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout"; 
import { ThemeProvider } from "../context/ThemeContext"; 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
