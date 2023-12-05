import UserActions from '@/actions/user';
import { error, success, init, validateService } from '@/modules/core';

export const getUsers = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, search } =
      event.queryStringParameters || {};
    const filter: any = {
      name: search ? (search as string) : '',
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const users = await UserActions.findAllAndPaginated(filter);
    const count = await UserActions.count(filter);
    const res_payload = {
      data: users,
      pagination: {
        total: count,
      },
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
