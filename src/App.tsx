import { useState } from 'react';
import { BrowserRouter } from 'react-router';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

import { ErrorBoundary } from '@/components';
import { SearchPage } from '@/pages';

dayjs.extend(relativeTime);

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Disable automatic retries to avoid hitting GitHub's rate limits
          queries: { retry: false },
        },
      }),
  );

  return (
    <BrowserRouter>
      <NuqsAdapter>
        <MantineProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <SearchPage />
            </ErrorBoundary>
            {import.meta.env.DEV && <ReactQueryDevtools />}
          </QueryClientProvider>
        </MantineProvider>
      </NuqsAdapter>
    </BrowserRouter>
  );
}

export default App;
