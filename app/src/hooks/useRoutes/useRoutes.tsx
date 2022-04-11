type RouteMap = {
  auth: {
    signIn: string;
  };
  api: {
    getCheckoutURL: string;
    auth: string;
    graphql: string;
  };
  dashboard: {
    latestTrends: (pageSlug: string) => string;
    sports: (pageSlug: string) => string;
    bets: (pageSlug: string) => string;
    profile: (pageSlug: string) => string;
  };
  home: string;
  notFound: string;
  invest: {
    grid: string;
    map: string;
    data: string;
  };
  campaign: (campaignSlug: string) => string;
  property: {
    details: (propertySlug: string) => string;
    preview: (responseId: string) => string;
    index: (contractAddress: string) => string;
  };
  properties: {
    explorer: () => string;
  };
};

export const routes: RouteMap = {
  auth: {
    signIn: "/a",
  },
  api: {
    getCheckoutURL: `/api/getCheckoutURL`,
    auth: `/api/auth`,
    graphql: `/api/graphql`,
  },
  invest: {
    grid: "/i",
    map: "/i/map",
    data: "/i/data",
  },
  dashboard: {
    latestTrends: () => `/`,
    sports: () => `/sports`,
    bets: () => `/bets`,
    profile: () => `/profile`,
  },
  home: "/",
  notFound: "/404",
  campaign: (campaignSlug) => `/c/${campaignSlug}`,
  property: {
    details: (propertySlug) => `/p/${propertySlug}`,
    preview: (responseId) => `/p/preview?responseId=${responseId}`,
    index: (contractAddress: string) => `/p?contractAddress=${contractAddress}`,
  },
  properties: {
    explorer: () => `/p/explorer`,
  },
};

export const useRoutes: () => RouteMap = () => routes;
