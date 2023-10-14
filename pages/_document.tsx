import { Html, Head, Main, NextScript } from 'next/document';
import * as React from "react";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
            />
            <link rel="icon" href="/favicon.ico"/>
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
