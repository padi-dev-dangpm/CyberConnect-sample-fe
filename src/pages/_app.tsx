import '@/styles/globals.scss';
import 'antd/dist/reset.css';

// import 'antd/dist/antd.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import store, { persistor } from '@/configs/redux';
import LayoutDefault from '@/layouts/LayoutDefault';

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bscTestnet } from "wagmi/chains";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/configs/apollo";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    })
  );

  const { provider } = configureChains(
    [bscTestnet],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    provider,
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <WagmiConfig client={client}>
              <LayoutDefault>
                <Component {...pageProps} />
              </LayoutDefault>
            </WagmiConfig>
          </QueryClientProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>

  );
};

export default MyApp;
