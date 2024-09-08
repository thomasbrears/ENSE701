import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import PopulatedNavBar from "../components/PopulatedNavBar";
import dotenv from 'dotenv';

dotenv.config();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <PopulatedNavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
