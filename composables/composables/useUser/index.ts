import { UseUser } from '@vue-storefront/core';
import { UserInfo } from '../../types';

import { params, useUserFactory } from './factoryParams';
//import { useUserFactory } from '@vue-storefront/core';

const useUser: () => UseUser<UserInfo, any> = useUserFactory<UserInfo, any, any>(params);

export default useUser;
