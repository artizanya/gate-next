// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import App, { Container, NextAppContext, DefaultAppIProps } from 'next/app';

import { GateRefContextProvider } from '../models/gate';
// import { GateApiContextProvider } from '../models/land-api';

class GateApp extends App {
  static async getInitialProps(
    { Component, ctx }: NextAppContext,
  ): Promise<DefaultAppIProps> {
    let pageProps = {};

    // Provide the store to getInitialProps of pages
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
      });
    }

    return {
      pageProps,
    };
  }

  // <GateContextProvider>
  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <GateRefContextProvider>
          <Component {...pageProps} />
        </GateRefContextProvider>
      </Container>
    );
  }
}

export default GateApp;
