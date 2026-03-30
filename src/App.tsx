import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { SearchPage } from '@/pages';

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
