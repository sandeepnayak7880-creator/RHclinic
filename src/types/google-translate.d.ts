declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: unknown;
          }, elementId: string): unknown;
          InlineLayout: {
            SIMPLE: unknown;
          };
        };
      };
    };
  }
}

export {};