import GenerationResultAIActions from '@/actions/GenerationResultAI';
import { error, success, init, validateService } from '@/modules/core';

export const getResults = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, template_id } =
      event.queryStringParameters || {};
    const filter: any = {
      page_number: Number(page_number || 1),
      page_size: Number(page_size || 10),
    };
    if (template_id) {
      filter.template_obj_id = template_id;
    }
    const data = await GenerationResultAIActions.findAllAndPaginated(filter);
    const count = await GenerationResultAIActions.count(filter);
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
