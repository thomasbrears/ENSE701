import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/Layout"; // Import Layout
import dotenv from 'dotenv';

dotenv.config();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
