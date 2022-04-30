type RouteMap = {
  dashboard: {
    latestTrends: () => string;
    market: () => string;
    sports: (pageSlug: string) => string;
    bets: (pageSlug: string) => string;
    profile: (pageSlug: string) => string;
  };
};

export const routes: RouteMap = {
  dashboard: {
    latestTrends: () => `/`,
    market: () => `/market/id`,
    sports: () => `/sports`,
    bets: () => `/bets`,
    profile: () => `/profile`,
  },
};

export const useRoutes: () => RouteMap = () => routes;
