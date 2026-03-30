import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

type ErrorAlertProps = {
  /** Optional error message to display. Defaults to a generic message if not provided. */
  message?: string;
};

export function ErrorAlert({
  message = 'Something went wrong.',
}: ErrorAlertProps) {
  return (
    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
      {message}
    </Alert>
  );
}
