import RoleActions from '@/actions/role';
import { error, success, init, validateService } from '@/modules/core';

export const getRoles = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number } = event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const roles = await RoleActions.findAllAndPaginated(filter);
    const count = await RoleActions.count(filter);
    const res_payload = {
      data: roles,
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
