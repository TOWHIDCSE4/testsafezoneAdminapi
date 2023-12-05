import AdminActions from '@/actions/admin';
import { error, success, init, validateService } from '@/modules/core';

export const getEmployees = validateService(async (event) => {
  await init();

  try {
    const { search, page_size, page_number } =
      event.queryStringParameters || {};
    const filter: any = {
      search: search ? (search as string) : '',
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const roles = await AdminActions.findAllAndPaginated(filter);
    const count = await AdminActions.count(filter);
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
