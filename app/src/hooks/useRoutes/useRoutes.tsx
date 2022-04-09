type RouteMap = {
  auth: {
    signIn: string;
  };
  api: {
    getCheckoutURL: string;
    auth: string;
    graphql: string;
  };
  app: {
    dashboard: string;
    sports: string;
    bets: string;
    profile: string;
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
  app: {
    dashboard: "/app/dashboard",
    sports: "/app/sports",
    bets: "/app/bets",
    profile: "/app/profile",
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
