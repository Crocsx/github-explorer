import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchState } from '../useSearchState';

// hasMemory: true makes the adapter persist URL state changes between calls,
// simulating real browser URL behavior in tests.
const wrapper = withNuqsTestingAdapter({ hasMemory: true });

describe('useSearchState', () => {
  describe('clearSearch', () => {
    it('resets inputValue and keyword to empty string', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.setInputValue('react'));
      act(() => result.current.handleSearch());
      act(() => result.current.clearSearch());

      expect(result.current.inputValue).toBe('');
      expect(result.current.keyword).toBe('');
    });
  });

  describe('handleSortChange', () => {
    it('sets sort and resets order to null and page to 1', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.handlePageChange(3));
      act(() => result.current.handleSortChange('stars'));

      expect(result.current.sort).toBe('stars');
      expect(result.current.order).toBeNull();
      expect(result.current.page).toBe(1);
    });

    it('clears sort when called with null', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.handleSortChange('stars'));
      act(() => result.current.handleSortChange(null));

      expect(result.current.sort).toBeNull();
    });
  });

  describe('handleOrderChange', () => {
    it('sets order and resets page to 1', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.handlePageChange(3));
      act(() => result.current.handleOrderChange('asc'));

      expect(result.current.order).toBe('asc');
      expect(result.current.page).toBe(1);
    });
  });

  describe('handleSearch', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('applies current inputValue as keyword immediately', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.setInputValue('react'));
      act(() => result.current.handleSearch());

      expect(result.current.keyword).toBe('react');
    });

    it('cancels pending debounce so the debounced value does not overwrite the submitted value', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      // Trigger debounce with 'react'
      act(() => result.current.handleInputChange('react'));

      // Before the 500ms fires, user clears input and submits 'vue' manually
      act(() => result.current.setInputValue('vue'));
      act(() => result.current.handleSearch());

      expect(result.current.keyword).toBe('vue');

      // Run all timers — the cancelled debounce must not overwrite 'vue'
      act(() => vi.runAllTimers());

      expect(result.current.keyword).toBe('vue');
    });

    it('resets page to 1', () => {
      const { result } = renderHook(() => useSearchState(), { wrapper });

      act(() => result.current.handlePageChange(4));
      act(() => result.current.setInputValue('typescript'));
      act(() => result.current.handleSearch());

      expect(result.current.page).toBe(1);
    });
  });
});
