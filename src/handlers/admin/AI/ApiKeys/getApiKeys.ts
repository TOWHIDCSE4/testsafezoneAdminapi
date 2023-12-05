import ApiKeyAIActions from '@/actions/ApiKeyAI';
import { error, success, init, validateService } from '@/modules/core';

export const getApiKeys = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number } = event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const data = await ApiKeyAIActions.findAllAndPaginated(filter);
    const count = await ApiKeyAIActions.count(filter);
    const res_payload = {
      data,
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
