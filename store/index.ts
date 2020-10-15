type CheckoutPage = {
  title: string;
  details?: string;
  badgeNumber?: string;
}
export const state = () => ({
  env: {},
  checkoutPage: {
    title: '',
    details: '',
    badgeNumber: ''
  }
});

export const mutations = {
  setEnv(state: any, env: any) {
    state.env = env;
  },
  setCheckoutPage(state: any, checkoutPage: CheckoutPage) {
    state.checkoutPage = { ...state.checkoutPage, ...checkoutPage };
  }
};

export const actions = {
  nuxtServerInit({ commit }: { commit: any }) {
    if (process.server) {
      commit('setEnv', {
        PRODUCTION: process.env.PRODUCTION,
        BASE_API_URL: process.env.BASE_API_URL,
        CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
        CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
        TWEAKWISE_INSTANCE_KEY: process.env.TWEAKWISE_INSTANCE_KEY,
        COOKIEBOT_ID: process.env.COOKIEBOT_ID,
        GTAGMANAGER_ID: process.env.GTAGMANAGER_ID
      });
    }
  }
};
