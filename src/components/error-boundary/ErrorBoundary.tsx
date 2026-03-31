import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { Button, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Stack align="center" gap="xs" py="xl" c="dimmed">
          <IconAlertTriangle size={40} stroke={1.5} />
          <Title order={4}>Something went wrong</Title>
          <Text size="sm">{this.state.error.message}</Text>
          <Button variant="subtle" size="xs" onClick={this.reset}>
            Try again
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}
