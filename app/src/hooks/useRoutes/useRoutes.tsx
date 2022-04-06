type RouteMap = {
  realEstate: {
    solana: {
      properties: string;
      property: (tokenMetadataId: string) => string;
      listProperty: string;
    };
  };
  auth: {
    signIn: string;
  };
  api: {
    getCheckoutURL: string;
    auth: string;
    graphql: string;
  };
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
  home: string;
  notFound: string;
};

export const routes: RouteMap = {
  realEstate: {
    solana: {
      properties: "/real-estate/solana",
      property: (tokenMetadataId: string) => `/real-estate/solana/property?tokenMetadataId=${tokenMetadataId}`,
      listProperty: "/real-estate/solana/list-property",
    },
  },
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
