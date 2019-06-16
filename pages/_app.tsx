// Hey Emacs, this is -*- coding: utf-8 -*-

import React from 'react';
import App, { Container, NextAppContext, DefaultAppIProps } from 'next/app';

import { GateModelContextProvider } from '../models/gate';
import { GateApiRefContextProvider } from '../models/land-api';

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

  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <GateModelContextProvider>
          <GateApiRefContextProvider>
            <Component {...pageProps} />
          </GateApiRefContextProvider>
        </GateModelContextProvider>
      </Container>
    );
  }
}

export default GateApp;
