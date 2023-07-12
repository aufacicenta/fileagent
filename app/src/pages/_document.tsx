import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta property="og:image" content="/prompt-wars/reddit-ad.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/prompt-wars/reddit-ad.png" />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-T6PR3QEEGR" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-T6PR3QEEGR');
        `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
