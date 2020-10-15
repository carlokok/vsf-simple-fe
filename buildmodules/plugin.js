import uiState from '~/assets/ui-state';
import { cookies, setup, userRefresh, currentToken, currentRefreshToken } from '~/api-client';
import { config } from '~/buildmodules/commerceapi-config.js';
import jwt_decode from "jwt-decode";

export default ({ app, store }) => {
  let tokenChanged = (token, refresh, anonid) => {
    if (!token || token === '') {
      app.$cookies.remove(cookies.tokenCookieName);
    } else {
      app.$cookies.set(cookies.tokenCookieName, token, {
        expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
        path: '/',
        sameSite: true
      });
    }
    if (!refresh || refresh === '') {
      app.$cookies.remove(cookies.refreshTokenCookieName);
    } else {
      app.$cookies.set(cookies.refreshTokenCookieName, refresh, {
        expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
        path: '/',
        sameSite: true
      });
    }
    if (!anonid || anonid === '') {
      app.$cookies.remove(cookies.anonIdCookieName);
    } else {
      app.$cookies.set(cookies.anonIdCookieName, anonid, {
        expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
        path: '/',
        sameSite: true
      });
    }
  };
  let resetToken = () => {
    setup({
      currentToken: null,
      currentRefreshToken: null
    })
    tokenChanged();
  }

  setup({
    ...config,
    basePath: store.state.env.BASE_API_URL || config.basePath,
    locales: config.locales,
    currencies: config.currencies,
    countries: config.countries,
    locale: app.$cookies.get(cookies.localeCookieName) || config.locale,
    currency: app.$cookies.get(cookies.currencyCookieName) || config.currency,
    country: app.$cookies.get(cookies.countryCookieName) || config.country,
    currentToken: app.$cookies.get(cookies.tokenCookieName),
    currentRefreshToken: app.$cookies.get(cookies.refreshTokenCookieName),
    currentCart: app.$cookies.get(cookies.cartCookieName),
    priceWithTax: app.$cookies.get(cookies.taxCookieName) != '0',
    anonid: app.$cookies.get(cookies.anonIdCookieName),
    tokenChanged,
    cartChanged: (id) => {
      if (!id || id === '') {
        app.$cookies.remove(cookies.cartCookieName);
      } else {
        app.$cookies.set(cookies.cartCookieName, id, {
          expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
          path: '/',
          sameSite: true
        });
      }
    }
  });
  if (currentToken && currentToken.value) {
    try {
      var tok = jwt_decode(currentToken.value);
      var current_time = Date.now() / 1000;
      if (current_time + 86400 > tok.exp) {
        if (currentRefreshToken.value) {
          userRefresh().catch(() =>{
            resetToken();
          });
        } else {
          resetToken();
        }
      }
    } catch {
      resetToken();
    }
  }
};
