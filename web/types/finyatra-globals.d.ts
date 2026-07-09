export {};

declare global {
  interface Window {
    FinYatraShare?: {
      copyElementPng: (elementId: string) => Promise<string>;
      copyText: (text: string) => Promise<string>;
    };
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    adsbygoogle?: unknown[];
  }
}
