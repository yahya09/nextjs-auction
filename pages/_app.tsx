import '@/styles/globals.css';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import {createPagesBrowserClient} from "@supabase/auth-helpers-nextjs";
import {useState} from "react";
import * as React from "react";
import Head from 'next/head';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
    <Head>
      <title>Jitera Auction</title>
      <meta name="description" content="Bid the best you can get"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>
    <Component {...pageProps} />
  </SessionContextProvider>;
}
