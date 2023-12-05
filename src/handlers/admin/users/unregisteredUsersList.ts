import UserActions from '@/actions/user';
import { error, success, init, validateService } from '@/modules/core';

export const unregisteredUsersList = validateService(async (event) => {
  await init();

  try {
    const { search } =
      event.queryStringParameters || {};
    const users = await UserActions.unregisteredUsersList(search);
    const res_payload = {
      data: users,
    };
    return success({
      code: '10000',
      data: res_payload,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
