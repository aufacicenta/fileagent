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
  app: {
    dashboard: "/app/dashboard",
    sports: "/app/sports",
    bets: "/app/bets",
    profile: "/app/profile",
  },
  home: "/",
  notFound: "/404",
};

export const useRoutes: () => RouteMap = () => routes;
