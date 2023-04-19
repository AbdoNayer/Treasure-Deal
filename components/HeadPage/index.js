import Head from "next/head";
import React from 'react';

export default function HeadPage({ namePage }) {

    return (
      <Head>

          {/* Name Page Title */}
          <title> treasure-deal </title>

          {/* Shortcut Icon */}
          <link rel="shortcut icon" href="/img/favicon.png" />

          {/* Meta Tag In Mobile */}
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="HandheldFriendly" content="true" />

          {/* Meta Tag Mobile Status Bar */}
          <meta name="theme-color" content="#121320" />
          <meta name="msapplication-navbutton-color" content="#121320" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#121320" />
          <meta name="description" content='treasure-deal' />

      </Head>
    )
  }
  