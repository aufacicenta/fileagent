type RouteMap = {
  home: () => string;
  market: {
    price: (args: { marketId: string }) => string;
  };
  api: {
    promptWars: {
      create: () => string;
      reveal: () => string;
      resolve: () => string;
    };
  };
  dashboard: {
    latestTrends: () => string;
    promptWars: () => string;
    market: (args: { marketId: string }) => string;
    sports: (pageSlug: string) => string;
    bets: (pageSlug: string) => string;
    profile: (pageSlug: string) => string;
  };
};

export const routes: RouteMap = {
  home: () => `/`,
  market: {
    price: ({ marketId }) => `/market/price/${marketId}`,
  },
  api: {
    promptWars: {
      create: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/create`,
      reveal: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/reveal`,
      resolve: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/resolve`,
    },
  },
  dashboard: {
    latestTrends: () => `/`,
    promptWars: () => `/prompt-wars`,
    market: ({ marketId }) => `/market/${marketId}`,
    sports: () => `/sports`,
    bets: () => `/bets`,
    profile: () => `/profile`,
  },
};

export const useRoutes: () => RouteMap = () => routes;
