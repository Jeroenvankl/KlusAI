import '@testing-library/jest-dom';

// Mock framer-motion — replace animated elements with plain HTML
jest.mock('framer-motion', () => {
  const React = require('react');

  const motionFactory = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        // Strip framer-motion-specific props
        if (
          !['initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap',
           'whileInView', 'transition', 'layoutId', 'custom', 'layout',
           'whileFocus', 'whileDrag', 'drag', 'dragConstraints',
          ].includes(k)
        ) {
          clean[k] = v;
        }
      }
      return React.createElement(tag, { ...clean, ref });
    });

  const handler = {
    get(_t: object, prop: string) {
      return motionFactory(prop);
    },
  };

  return {
    __esModule: true,
    motion: new Proxy({}, handler),
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0, onChange: jest.fn() } }),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock PaintCart context (used by verf pages)
jest.mock('@/components/paint/PaintCart', () => {
  const React = require('react');
  return {
    __esModule: true,
    useCart: () => ({
      items: [],
      totalItems: 0,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    }),
    CartProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
