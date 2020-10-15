import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { sharedRef, vsfRef } from '@vue-storefront/core';
import { Ref } from '@vue/composition-api';
import {
  CartApi,
  CatalogApi,
  OrderApi,
  ProductApi,
  StockApi,
  ReviewApi,
  UserApi,
  Configuration,
  CartItem,
  UserInfo,
  UserAddress,
  CreateOrderRequest,
  CreateReview,
  AggregateField,
  LoginResponse,
  WishlistApi,
  UpdateAddressRequestData,
  SocialUserApi,
  LookupApi
} from '../swagger';
import {CatalogAttributesRequest, CatalogCategoryRequest, CatalogReviewRequest, CatalogProductRequest} from '../types';

export * from '../swagger';
export * from '../types';

let cartApi: CartApi | null = null;
let catalogApi: CatalogApi | null = null;
let orderApi: OrderApi | null = null;
let productApi: ProductApi | null = null;
let stockApi: StockApi | null = null;
let reviewApi: ReviewApi | null = null;
let userApi: UserApi | null = null;
let wishlistApi: WishlistApi | null = null;
let socialUserApi: SocialUserApi | null = null;
let lookupApi: LookupApi | null = null;

let priceWithTax: Ref<boolean> = vsfRef<boolean>(true, "priceWithTax");
let basePath = 'http://localhost:9999';
let locale: Ref<string> = vsfRef<string>('en', "locale");
let currency: Ref<string> = vsfRef<string>('EUR', "currency");
let country : Ref<string>  = vsfRef<string>('nl', "country");
let currencies = [{code: 'EUR', label: 'Euro', prefixSign: true, sign: '€'}];
let countries = [{code: 'BE', label: 'België'}];
let locales = [{code: 'en', label: 'English'}];
let tokenChanged: (token?: string, refresh?: string, anonid?: string) => void = () => {
};
let cartChanged: (cartId?: string) => void = () => {
};

const cookies = {
  currencyCookieName: 'vsf-currency',
  countryCookieName: 'vsf-country',
  localeCookieName: 'vsf-locale',
  anonIdCookieName: 'vsf-anonid',
  taxCookieName: 'vsf-tax',
  cartCookieName: 'vsf-cart',
  tokenCookieName: 'vsf-token',
  refreshTokenCookieName: 'vsf-refresh'
};

export let currentToken: Ref<string | undefined> = vsfRef<string | undefined>(undefined, "currenttoken");
export let anonid : Ref<string | undefined> = vsfRef<string | undefined>(undefined, "anonid");
export let currentRefreshToken: Ref<string | undefined> = vsfRef<string | undefined>(undefined, "currentrefresh");
export let currentCart: Ref<string | undefined> = vsfRef<string | undefined>(undefined, "currentCart.value");

let methods = {
  cartApplyCoupon: (token?: string, cartId?: string, coupon?: string) => cartApi?.apiCartApplyCouponPost(token, cartId, coupon),
  cartCoupon: (token?: string, cartId?: string) => cartApi?.apiCartCouponGet(token, cartId),
  cartCreate: (token?: string) => cartApi?.apiCartCreatePost(token),
  cartDeleteCoupon: (token?: string, cartId?: string) => cartApi?.apiCartDeleteCouponPost(token, cartId),
  cartDelete: (token?: string, cartId?: string, cartItem?: CartItem) => cartApi?.apiCartDeletePost(token, cartId, cartItem),
  cartPaymentMethods: (token?: string, cartId?: string) => cartApi?.apiCartPaymentMethodsGet(token, cartId),
  cartPull: (token?: string, cartId?: string) => cartApi?.apiCartPullGet(token, cartId),
  cartShippingInformation: (token?: string, cartId?: string, carrierCode?: string, userAddress?: UserAddress) => cartApi?.apiCartShippingInformationPost(token, cartId, carrierCode, userAddress),
  cartShippingMethods: (token?: string, cartId?: string, userAddress?: UserAddress) => cartApi?.apiCartShippingMethodsPost(token, cartId, userAddress),
  cartTotals: (token?: string, cartId?: string) => cartApi?.apiCartTotalsGet(token, cartId),
  cartUpdate: (token?: string, cartId?: string, cartItem?: CartItem) => cartApi?.apiCartUpdatePost(token, cartId, cartItem),
  cartReOrderPost: (token?: string, cartId?: string, orderId?: string) => cartApi?.apiCartReOrderPost(token, cartId, orderId),
  catalogAttributes: (token?: string, skip?: number, take?: number) => catalogApi?.apiCatalogAttributesGet(token, skip, take),
  catalogCategories: (token?: string, levels?: Array<number>, active?: boolean, skip?: number, take?: number, parentId?: string, slug?: string, id?: Array<string>, urlPath?: string, sort?: string, filter?: string) => catalogApi?.apiCatalogCategoriesGet(token, levels, active, skip, take, parentId, slug, id, urlPath, sort, filter),
  catalogProducts: (token?: string, visibility?: Array<number>, status?: Array<number>, categoryId?: Array<string>, filter?: string, skip?: number, take?: number, urlpath?: string, sort?: string, sku?: Array<string>, categoryKeywords?: Array<string>, propertyFilters?: Array<string>, aggregates?: Array<AggregateField>, configurableChildren?: Array<string>) => catalogApi?.apiCatalogProductsGet(token, visibility, status, categoryId, filter, skip, take, urlpath, sort, sku, categoryKeywords, propertyFilters, aggregates, configurableChildren),
  catalogReviews: (token?: string, productId?: string, take?: number, skip?: number) => catalogApi?.apiCatalogReviewsGet(token, productId, take, skip),
  catalogCategoryTree: (token?: string) => catalogApi?.apiCatalogCategoryTreeGet(token),
  catalogResolveSlugGet: (token?: string, url?: string) => catalogApi?.apiCatalogResolveSlugGet(token, url),
  catalogRelatedProducts: (token?: string, categories?: string[], sku?: string) => catalogApi?.apiCatalogRelatedProductsGet(token, categories, sku),
  orderPaymentSubMethods: (paymentMethodId?: string) => orderApi?.apiOrderPaymentSubMethodsGet(paymentMethodId),
  order: (token?: string, cartId?: string, createOrderRequest?: CreateOrderRequest) => orderApi?.apiOrderOrderPost(token, cartId, createOrderRequest),
  orderStartPayment: (cartID?: string, orderID?: string, methodName?: string, subMethodName?: string, redirectURL?: string) => orderApi?.apiOrderStartPaymentPost(cartID, orderID, methodName, subMethodName, redirectURL),
  reviewCreate: (token?: string, createReview?: CreateReview) => reviewApi?.apiReviewCreatePost(token, createReview),
  stockCheck: (sku?: string) => stockApi?.apiStockCheckGet(sku),
  stockList: (sku?: string) => stockApi?.apiStockListPost(sku),
  productRenderList: (skus?: string, currencyCode?: string, storeId?: number, token?: string) => productApi?.apiProductRenderListGet(skus, currencyCode, storeId, token),
  userChangePassword: (token?: string, currentPassword?: string, newPassword?: string) => userApi?.apiUserChangePasswordPost(token, currentPassword, newPassword),
  userCreatePassword: (email?: string, newPassword?: string, resetToken?: string) => userApi?.apiUserCreatePasswordPost(email, newPassword, resetToken),
  userCreate: (firstname?: string, lastname?: string, email?: string, password?: string) => userApi?.apiUserCreatePost(firstname, lastname, email, password),
  userLogin: (username?: string, password?: string) => userApi?.apiUserLoginPost(username, password),
  userMe: (token?: string) => userApi?.apiUserMeGet(token),
  userMeSet: (token?: string, info?: UserInfo) => userApi?.apiUserMePost(token, info),
  userUpdateAddress: (token?: string, data?: UpdateAddressRequestData) => userApi?.apiUserMyAddressPost(token, data),
  userOrderHistory: (token?: string, skip?: number, open?: boolean, orderId?: string) => userApi?.apiUserOrderHistoryGet(token, skip, open, orderId),
  userInvoiceHistory: (token?: string, skip?: number, open?: boolean, invoiceId?: string) => userApi?.apiUserInvoicesHistoryGet(token, skip, open, invoiceId),
  userRefresh: (refreshToken?: string) => userApi?.apiUserRefreshPost(refreshToken),
  userResetPassword: (email?: string) => userApi?.apiUserResetPasswordPost(email),
  userGetMailings: (token?: string) => userApi?.apiUserMaillingsGet(token),
  userUpdateMailings: (token?: string, mailings?: string, subscribe?: boolean) => userApi?.apiUserMaillingsPost(token, mailings, subscribe),
  userDelete: (token?: string) => userApi?.apiUserUserDelete(token),
  wishlistAdditem: (token?: string, anonid?: string, name?: string, cartItem?: CartItem) => wishlistApi?.apiWishlistAdditemPost(token, anonid, name, cartItem),
  wishlistCreateAnonid: () => wishlistApi?.apiWishlistAnonidPost(),
  wishlistClear: (token?: string, anonid?: string, name?: string) => wishlistApi?.apiWishlistClearDelete(token, anonid, name),
  wishlistGetCreate: (token?: string, anonid?: string, name?: string) => wishlistApi?.apiWishlistCreatePut(token, anonid, name),
  wishlistRemoveitem: (token?: string, anonid?: string, name?: string, cartItem?: CartItem) => wishlistApi?.apiWishlistRemoveitemDelete(token, anonid, name, cartItem),

  socialLoginList: () => socialUserApi?.apiSocialUserSocialLoginsGet(),
  socialLoginGetKey: (key?: string) => socialUserApi?.apiSocialUserSocialLoginResolveKeyPost(key),

  userMaillingsGet: (token?: string) => userApi?.apiUserMaillingsGet(token),
  userMaillingsPost: (token?: string, mailling?: string, subscribe?: boolean) => userApi?.apiUserMaillingsPost(token, mailling, subscribe)
};

function override(overrides: any) {
  methods = {
    ...methods,
    ...overrides
  };
}

function setup(setupConfig: any) {
  locale.value = setupConfig.locale || locale.value;
  currency.value = setupConfig.currency || currency.value;
  country.value = setupConfig.country || country.value;
  currentToken.value = setupConfig.currentToken === null ? undefined :setupConfig.currentToken || currentToken.value;
  anonid.value= setupConfig.anonid === null ? undefined :setupConfig.anonid || anonid.value;
  currentRefreshToken.value = setupConfig.currentRefreshToken === null ? undefined : setupConfig.currentRefreshToken || currentRefreshToken.value;
  currentCart.value = setupConfig.currentCart || currentCart.value;
  priceWithTax.value = setupConfig.priceWithTax === undefined ? priceWithTax : setupConfig.priceWithTax;
  currencies = setupConfig.currencies || currencies;
  countries = setupConfig.countries || countries;
  locales = setupConfig.locales || locales;
  basePath = setupConfig.basePath || basePath;
  tokenChanged = setupConfig.tokenChanged || tokenChanged;
  cartChanged = setupConfig.cartChanged || cartChanged;
  if (setupConfig.basePath) {
    const config = new Configuration({
      basePath: setupConfig.basePath,
      baseOptions: {
        headers: {
          Country: country.value,
          Currency: currency.value,
          Language: locale.value
        }
      }
    });

    cartApi = new CartApi(config);
    catalogApi = new CatalogApi(config);
    orderApi = new OrderApi(config);
    productApi = new ProductApi(config);
    stockApi = new StockApi(config);
    reviewApi = new ReviewApi(config);
    userApi = new UserApi(config);
    wishlistApi = new WishlistApi(config);
    socialUserApi = new SocialUserApi(config);
    lookupApi = new LookupApi(config);
  }
}


const cartApplyCoupon = async (coupon: string) => (await methods.cartApplyCoupon(currentToken.value, currentCart.value, coupon))?.data;
const cartCoupon = async () => (await methods.cartCoupon(currentToken.value, currentCart.value))?.data;
const cartDeleteCoupon = async () => (await methods.cartDeleteCoupon(currentToken.value, currentCart.value))?.data;
const cartLoad = async () =>
{
  if (!currentCart.value) {
    currentCart.value = (await methods.cartCreate(currentToken.value))?.data;
    cartChanged(currentCart.value);
  }
    try {
      const data = await methods.cartTotals(currentToken.value, currentCart.value)!;
      if (data.status === 404) {

      }
      return data.data;
    } catch (e) {
      if (e.response.status == 404) {
        currentCart.value = (await methods.cartCreate(currentToken.value))?.data;
        const data = await methods.cartTotals(currentToken.value, currentCart.value);
        cartChanged(currentCart.value);
        return data!.data!;
      } else
        throw e;
    }
};
const cartUpdate = async (item: CartItem) => {
  await methods.cartUpdate(currentToken.value, currentCart.value, item);
  return (await methods.cartTotals(currentToken.value, currentCart.value))?.data;
};
const cartDelete = async (item: CartItem) => {
  await methods.cartDelete(currentToken.value, currentCart.value, item);
  return (await methods.cartTotals(currentToken.value, currentCart.value))?.data;
};
const cartClear = async () => {
  const items = (await methods.cartPull(currentToken.value, currentCart.value))?.data!;
  for (const el in items) {
    await methods.cartDelete(currentToken.value, currentCart.value, items[el]);
  }
  return (await methods.cartTotals(currentToken.value, currentCart.value))?.data;
};
const cartReOrder = async(cartId: string, orderId: string) => (await methods.cartReOrderPost(currentToken.value, cartId, orderId))?.data;
const catalogAttributes = async (req: CatalogAttributesRequest) => (await methods.catalogAttributes(currentToken.value, req.skip, req.take))?.data;
const catalogCategories = async (req: CatalogCategoryRequest) => (await methods.catalogCategories(currentToken.value, req.levels, req.active, req.skip, req.take, req.parentId, req.slug, req.id, req.urlPath, req.sort, req.filter))?.data;
const catalogProducts = async (req: CatalogProductRequest) => {
  let fil: string[] | undefined = undefined;
  if (req.propertyFilters) {
    fil = [];
    for (const key in req.propertyFilters) {
      fil.push(key + '=' + req.propertyFilters[key].join(','));
    }
  }
  return (await methods.catalogProducts(currentToken.value, req.visibility, req.status, req.categoryId, req.filter, req.skip, req.take, req.urlpath, req.sort, req.sku, req.categoryKeywords, fil, req.aggregates, req.configurableChildren))?.data;
};
const catalogReviews = async (req: CatalogReviewRequest) => (await methods.catalogReviews(currentToken.value, req.productId, req.take, req.skip))?.data;
const catalogCategoryTree = async () => (await methods.catalogCategoryTree(currentToken.value))?.data;
const catalogResolveSlug = async (url?: string) => (await methods.catalogResolveSlugGet(currentToken.value, url))?.data;
const catalogRelatedProducts = async (categories?: string[], sku?: string) => (await methods.catalogRelatedProducts(currentToken.value, categories, sku))?.data;
const stockCheck = methods.stockCheck;
const stockList = methods.stockList;
const productRenderList = methods.productRenderList;

const userChangePassword = async (currentPassword: string, newPassword: string) => (await methods.userChangePassword(currentToken.value, currentPassword, newPassword))?.data;
const userResetPassword = async (email: string) => (await methods.userResetPassword(email))?.data;
const userCreatePassword = async (email: string, newPassword: string, resetToken: string) => (await methods.userCreatePassword(email, newPassword, resetToken))?.data;
const userCreate = async (firstName: string, lastName: string, email: string, password: string) => {
  const res = (await methods.userCreate(firstName, lastName, email, password))?.data;
  if (res) {
    await userLogin(email, password);
  }
  return res;
};

const tokenLogin = async (token: string, refresh: string) => {

  const oldId = currentCart.value;
  const cartContent = (await cartLoad())!;
  const oldWishlist = anonid != null ? await wishlistGetCreate('default') : null;

  currentRefreshToken.value = refresh!;
  currentToken.value = token!;
  anonid.value = undefined;
  tokenChanged(currentToken.value, currentRefreshToken.value, undefined);

  await cartLoad();
  if (currentCart.value !== oldId) {
    for (let i = 0; i < cartContent.items!.length; i++) {
      await cartUpdate(cartContent.items![i]);
    }
  }
  // push the wishlist items into the customer wishlist after login.
  if (oldWishlist?.list && oldWishlist.list.length > 0) {
    for (let i = 0; i < oldWishlist.list.length; i++)
      await wishlistAdditem('default', oldWishlist.list[i]);
  }
};

const userLogin = async (email: string, password: string) => {
  let newTok: LoginResponse;
  try {
    newTok = (await (methods.userLogin(email, password)))?.data!;
    if (!newTok) return 0;
    if (newTok.failureReason && newTok.failureReason > 0) return -newTok.failureReason;
  } catch {
    return 0;
  }
  const oldId = currentCart.value;
  const cartContent = (await cartLoad())!;
  const oldWishlist = anonid != null ? await wishlistGetCreate('default') : null;

  currentRefreshToken.value = newTok.refresh!;
  currentToken.value = newTok.token!;
  anonid.value = undefined;
  tokenChanged(currentToken.value, currentRefreshToken.value, undefined);

  await cartLoad();
  if (currentCart.value !== oldId) {
    for (let i = 0; i < cartContent.items!.length; i++) {
      await cartUpdate(cartContent.items![i]);
    }
  }
  // push the wishlist items into the customer wishlist after login.
  if (oldWishlist?.list && oldWishlist.list.length > 0) {
    for (let i = 0; i < oldWishlist.list.length; i++)
      await wishlistAdditem('default', oldWishlist.list[i]);
  }
  return 1;
};

const userMe = async () => {
  if (!currentToken.value) return null;
  try {
    return (await methods.userMe(currentToken.value))?.data;
  } catch {
    if (currentRefreshToken) {
      currentToken.value = (await methods.userRefresh(currentRefreshToken.value))?.data;
      tokenChanged(currentToken.value, currentRefreshToken.value);
      return (await methods.userMe(currentToken.value))?.data;
    } else {
      tokenChanged(undefined, undefined);
      return undefined;
    }
  }
};
const userMeSet = async (newData: UserInfo) => (await methods.userMeSet(currentToken.value, newData))?.data;
const userRefresh = async () => {
  currentToken.value = (await methods.userRefresh(currentRefreshToken.value))?.data;
  tokenChanged(currentToken.value, currentRefreshToken.value);
};


const userMaillingsGet = async() => (await methods.userMaillingsGet(currentToken.value))?.data;
const userMaillingsUpdate = async(mailling: string, subscribe: boolean) => (await methods.userMaillingsPost(currentToken.value, mailling, subscribe))?.data;

const userOrderHistory = async (skip: number, open?: boolean, orderId?: string) => (await methods.userOrderHistory(currentToken.value, skip, open, orderId))?.data;
const userInvoiceHistory = async (skip: number, open?: boolean, invoiceId?: string) => (await methods.userInvoiceHistory(currentToken.value, skip, open, invoiceId))?.data;
const userUpdateAddress = async (data?: UpdateAddressRequestData) => (await methods.userUpdateAddress(currentToken.value, data))?.data;
const userLogout = async () => {
  currentToken.value = undefined;
  currentRefreshToken.value = undefined;
  tokenChanged(currentToken.value, currentRefreshToken.value);
};
const userMailings = async () => (await methods.userGetMailings(currentToken.value))?.data;
const userMailingsUpdate = async (mailing?: string, subscribe?: boolean) => (await methods.userUpdateMailings(currentToken.value, mailing, subscribe))?.data;
const userUserDelete = async () => (await methods.userDelete(currentToken.value))?.data;

const cartPaymentMethods = async () => (await methods.cartPaymentMethods(currentToken.value, currentCart.value))?.data;
const cartShippingInformation = async (carrierCode: string, userAddress: UserAddress) => (await methods.cartShippingInformation(currentToken.value, currentCart.value, carrierCode, userAddress))?.data;
const cartShippingMethods = async (address: UserAddress) => (await methods.cartShippingMethods(currentToken.value, currentCart.value, address))?.data;
const orderPaymentSubMethods = async (method: string) => (await methods.orderPaymentSubMethods(method))?.data;
const order = async (data: CreateOrderRequest) => {
  const res = (await methods.order(currentToken.value, currentCart.value, data))?.data;

  currentCart.value = undefined;
  await cartLoad();

  return res;
};
const orderStartPayment = async (orderID?: string, methodName?: string, subMethodName?: string, redirectURL?: string) => (await methods.orderStartPayment(currentToken.value, orderID, methodName, subMethodName, redirectURL))?.data;
const getAnonId = async () => {
  if (currentToken.value == null) {
    if (anonid.value == null) {
      anonid.value = (await methods.wishlistCreateAnonid())?.data;
      tokenChanged(currentToken.value, currentRefreshToken.value, anonid.value);
    }
    return anonid.value;
  }
  return undefined;
};
const wishlistAdditem = async (name?: string, cartItem?: CartItem) => (await methods.wishlistAdditem(currentToken.value, await getAnonId(), name, cartItem))?.data;
const wishlistRemoveitem = async (name?: string, cartItem?: CartItem) => (await methods.wishlistRemoveitem(currentToken.value, await getAnonId(), name, cartItem))?.data;
const wishlistClear = async (name?: string) => (await methods.wishlistClear(currentToken.value, await getAnonId(), name))?.data;
const wishlistGetCreate = async (name?: string) => (await methods.wishlistGetCreate(currentToken.value, await getAnonId(), name))?.data;
const socialLoginList = async () => (await methods.socialLoginList())?.data;
const socialLoginGetKey = async (key?: string) => (await methods.socialLoginGetKey(key))?.data;



export {

  override,
  setup,
  cartApplyCoupon,
  cartCoupon,
  cartDeleteCoupon,

  cartLoad,
  cartDelete,
  cartUpdate,
  cartClear,
  catalogAttributes,
  catalogCategories,
  catalogProducts,
  catalogReviews,
  catalogCategoryTree,
  catalogResolveSlug,
  catalogRelatedProducts,
  stockCheck,
  stockList,
  productRenderList,
  userChangePassword,
  userCreatePassword,
  userCreate,
  userLogin,
  tokenLogin,
  userMe,
  userMeSet,
  userOrderHistory,
  userRefresh,
  userResetPassword,
  userLogout,
  userUpdateAddress,
  userMailings,
  userMailingsUpdate,
  userUserDelete,

  cartPaymentMethods,
  cartShippingInformation,
  cartShippingMethods,
  cartReOrder,
  orderPaymentSubMethods,
  order,
  orderStartPayment,

  wishlistAdditem,
  wishlistClear,
  wishlistRemoveitem,
  wishlistGetCreate,

  socialLoginList,
  socialLoginGetKey,


  userMaillingsGet,
  userMaillingsUpdate,
  userInvoiceHistory,

  basePath,
  locale,
  priceWithTax,
  currency,
  country,
  countries,
  locales,
  currencies,
  cookies
};
