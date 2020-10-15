import { useUserOrdersFactory, UseUserOrdersFactoryParams, OrdersSearchResult } from '@vue-storefront/core';
import { CartTotal, SearchOrderHistory, userOrderHistory } from '../../types';

const params: UseUserOrdersFactoryParams<CartTotal, SearchOrderHistory> = {
  searchOrders: async ({ skip }: SearchOrderHistory = {skip: 0}): Promise<OrdersSearchResult<CartTotal>> => {
    const result = (await userOrderHistory(skip))!;
    return { data: result.items || [], total: result.totalCount || 0 };
  }
};

export default useUserOrdersFactory<CartTotal, SearchOrderHistory>(params);
