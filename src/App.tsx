import { BrowserRouter } from 'react-router';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

import { SearchPage } from '@/pages';

const queryClient = new QueryClient();

dayjs.extend(relativeTime);

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <MantineProvider>
          <QueryClientProvider client={queryClient}>
            <SearchPage />
            {import.meta.env.DEV && <ReactQueryDevtools />}
          </QueryClientProvider>
        </MantineProvider>
      </NuqsAdapter>
    </BrowserRouter>
  );
}

export default App;
