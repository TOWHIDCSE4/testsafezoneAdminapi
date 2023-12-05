import TemplateActions from '@/actions/template';
import { error, success, init, validateService } from '@/modules/core';

export const getTemplates = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number } = event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const roles = await TemplateActions.findAllAndPaginated(filter);
    const count = await TemplateActions.count(filter);
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
