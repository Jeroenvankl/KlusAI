/**
 * KlusAI Webapp — Regression Test Suite
 *
 * Run: npm test
 * Run verbose: npm run test:regression
 *
 * Tests every page renders without crashing and has key UI elements.
 * Run after every change to catch regressions.
 */

/* eslint-disable @typescript-eslint/no-require-imports */

import '@testing-library/jest-dom';

// ── Mocks (hoisted by Jest) ──────────────────────────────

jest.mock('framer-motion', () => {
  const React = require('react');
  const motionFactory = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (
          !['initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap',
           'whileInView', 'transition', 'layoutId', 'custom', 'layout'].includes(k)
        ) {
          clean[k] = v;
        }
      }
      return React.createElement(tag, { ...clean, ref });
    });
  return {
    __esModule: true,
    motion: new Proxy({}, { get: (_t: object, p: string) => motionFactory(p) }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0, onChange: jest.fn() } }),
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/components/paint/PaintCart', () => {
  const React = require('react');
  return {
    __esModule: true,
    useCart: () => ({ items: [], totalItems: 0, addItem: jest.fn(), removeItem: jest.fn(), updateQuantity: jest.fn(), clearCart: jest.fn() }),
    CartProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

// ── Polyfills ─────────────────────────────────────────────

beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: class { observe() {} unobserve() {} disconnect() {} },
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addListener: jest.fn(), removeListener: jest.fn(),
      addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
    })),
  });
});

// ── Test imports ──────────────────────────────────────────

import React from 'react';
import { render, screen } from '@testing-library/react';

// ── 1. Dashboard ──────────────────────────────────────────

describe('Dashboard (/)', () => {
  it('renders KlusAI title and 6 module tiles', async () => {
    const { default: Page } = await import('@/app/page');
    render(<Page />);
    expect(screen.getByText('KlusAI')).toBeInTheDocument();
    expect(screen.getByText('Verf & Kleuren')).toBeInTheDocument();
    expect(screen.getByText('Ontwerp & Inspiratie')).toBeInTheDocument();
    expect(screen.getByText('Mijn Ruimte')).toBeInTheDocument();
    expect(screen.getByText('Budget & Duurzaamheid')).toBeInTheDocument();
    expect(screen.getByText('Bouw & Klushulp')).toBeInTheDocument();
    expect(screen.getByText('Voorbeeld Nadoen')).toBeInTheDocument();
  });
});

// ── 2. Verf & Kleuren ─────────────────────────────────────

describe('Verf module', () => {
  it('/verf — renders color browser', async () => {
    const { default: Page } = await import('@/app/verf/page');
    render(<Page />);
    expect(screen.getByText('Verf & Kleuren')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Zoek op kleur/i)).toBeInTheDocument();
  });
});

// ── 3. Ontwerp & Inspiratie ───────────────────────────────

describe('Ontwerp module', () => {
  it('/ontwerp — renders style tiles', async () => {
    const { default: Page } = await import('@/app/ontwerp/page');
    render(<Page />);
    expect(screen.getByText('Ontwerp & Inspiratie')).toBeInTheDocument();
    expect(screen.getAllByText('Japandi').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Minimalistisch')).toBeInTheDocument();
  });

  it('/ontwerp/resultaat — renders', async () => {
    const { default: Page } = await import('@/app/ontwerp/resultaat/page');
    render(<Page />);
    expect(document.body).toBeTruthy();
  });
});

// ── 4. Budget & Duurzaamheid ──────────────────────────────

describe('Budget module', () => {
  it('/budget — renders projects', async () => {
    const { default: Page } = await import('@/app/budget/page');
    render(<Page />);
    expect(screen.getByText('Budget & Duurzaamheid')).toBeInTheDocument();
    expect(screen.getByText('Woonkamer renovatie')).toBeInTheDocument();
  });

  it('/budget/calculator — renders', async () => {
    const { default: Page } = await import('@/app/budget/calculator/page');
    render(<Page />);
    expect(screen.getByText('Budgetcalculator')).toBeInTheDocument();
  });

  it('/budget/eco — renders', async () => {
    const { default: Page } = await import('@/app/budget/eco/page');
    render(<Page />);
    expect(screen.getByText('Duurzaam klussen')).toBeInTheDocument();
  });
});

// ── 5. Bouw & Klushulp ───────────────────────────────────

describe('Bouw module', () => {
  it('/bouw — renders templates', async () => {
    const { default: Page } = await import('@/app/bouw/page');
    render(<Page />);
    expect(screen.getByText('Bouw & Klushulp')).toBeInTheDocument();
    expect(screen.getByText('Muur schilderen')).toBeInTheDocument();
  });

  it('/bouw/plan — renders', async () => {
    const { default: Page } = await import('@/app/bouw/plan/page');
    render(<Page />);
    expect(document.body).toBeTruthy();
  });

  it('/bouw/veiligheid — renders safety', async () => {
    const { default: Page } = await import('@/app/bouw/veiligheid/page');
    render(<Page />);
    expect(screen.getByText('Veiligheidstips')).toBeInTheDocument();
  });
});

// ── 6. Voorbeeld Nadoen ──────────────────────────────────

describe('Voorbeeld Nadoen module', () => {
  it('/voorbeeld-nadoen — renders', async () => {
    const { default: Page } = await import('@/app/voorbeeld-nadoen/page');
    render(<Page />);
    expect(screen.getByText('Voorbeeld Nadoen')).toBeInTheDocument();
    expect(screen.getByText('Voorbeelden')).toBeInTheDocument();
  });

  it('/voorbeeld-nadoen/analyse — renders', async () => {
    const { default: Page } = await import('@/app/voorbeeld-nadoen/analyse/page');
    render(<Page />);
    expect(document.body).toBeTruthy();
  });
});

// ── 7. Mijn Ruimte ──────────────────────────────────────

describe('Mijn Ruimte module', () => {
  it('/mijn-ruimte — renders rooms', async () => {
    const { default: Page } = await import('@/app/mijn-ruimte/page');
    render(<Page />);
    expect(screen.getByText('Mijn Ruimte')).toBeInTheDocument();
    expect(screen.getByText('Mijn kamers')).toBeInTheDocument();
  });

  it('/mijn-ruimte/scan — renders wizard', async () => {
    const { default: Page } = await import('@/app/mijn-ruimte/scan/page');
    render(<Page />);
    expect(screen.getByText('Ruimte scannen')).toBeInTheDocument();
  });

  it('/mijn-ruimte/model — renders', async () => {
    const { default: Page } = await import('@/app/mijn-ruimte/model/page');
    render(<Page />);
    expect(document.body).toBeTruthy();
  });

  it('/mijn-ruimte/meubels — renders library', async () => {
    const { default: Page } = await import('@/app/mijn-ruimte/meubels/page');
    render(<Page />);
    expect(screen.getByText('Meubelbibliotheek')).toBeInTheDocument();
  });
});

// ── 8. Live Hulp ──────────────────────────────────────────

describe('Live Hulp', () => {
  it('/live-hulp — renders', async () => {
    const { default: Page } = await import('@/app/live-hulp/page');
    render(<Page />);
    expect(screen.getByText('Live Hulp')).toBeInTheDocument();
    expect(screen.getByText('Start camera')).toBeInTheDocument();
  });
});

// ── 9. UI Components ────────────────────────────────────

describe('UI Components', () => {
  it('ErrorBoundary renders children', async () => {
    const { default: EB } = await import('@/components/ui/ErrorBoundary');
    render(<EB><p>OK</p></EB>);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});

// ── 10. Constants ────────────────────────────────────────

describe('Constants', () => {
  it('MODULES has 6 items', async () => {
    const { MODULES } = await import('@/lib/constants');
    expect(MODULES).toHaveLength(6);
  });

  it('NAV_ITEMS has 7 items', async () => {
    const { NAV_ITEMS } = await import('@/lib/constants');
    expect(NAV_ITEMS).toHaveLength(7);
  });
});

describe('API Client', () => {
  it('exports all functions', async () => {
    const api = await import('@/lib/api-client');
    for (const fn of ['getHealth', 'applyPaint', 'searchColors', 'suggestDesign', 'createBuildPlan', 'reverseAnalyze']) {
      expect(typeof (api as Record<string, unknown>)[fn]).toBe('function');
    }
  });
});

// ── 11. Build integrity ──────────────────────────────────

describe('Build integrity', () => {
  it('all 20 routes export default', async () => {
    const routes = [
      '@/app/page', '@/app/verf/page', '@/app/verf/preview/page',
      '@/app/verf/vergelijk/page', '@/app/verf/winkelwagen/page',
      '@/app/ontwerp/page', '@/app/ontwerp/resultaat/page',
      '@/app/budget/page', '@/app/budget/calculator/page', '@/app/budget/eco/page',
      '@/app/bouw/page', '@/app/bouw/plan/page', '@/app/bouw/veiligheid/page',
      '@/app/voorbeeld-nadoen/page', '@/app/voorbeeld-nadoen/analyse/page',
      '@/app/mijn-ruimte/page', '@/app/mijn-ruimte/scan/page',
      '@/app/mijn-ruimte/model/page', '@/app/mijn-ruimte/meubels/page',
      '@/app/live-hulp/page',
    ];
    for (const r of routes) {
      const m = await import(r);
      expect(typeof m.default).toBe('function');
    }
  });
});
