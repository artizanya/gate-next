import App, { Container } from 'next/app';

import {
  GateModelContextProvider
} from '../models/gate';

class GateApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    // Provide the store to getInitialProps of pages
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
      });
    }

    return {
      pageProps,
    }
  }

  render () {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <GateModelContextProvider>
          <Component {...pageProps} />
        </GateModelContextProvider>
      </Container>
    );
  }
}

export default GateApp;
