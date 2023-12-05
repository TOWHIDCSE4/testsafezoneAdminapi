import PromptAIActions from '@/actions/PromptAI';
import { EnumPromptAIStatus } from '@/models/AI';
import { error, success, init, validateService } from '@/modules/core';

export const getPrompts = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, search, category } =
      event.queryStringParameters || {};
    const status: any = parseInt(event.queryStringParameters.status as string);
    const filter: any = {
      page_number: Number(page_number || 1),
      page_size: Number(page_size || 10),
    };
    if (status === EnumPromptAIStatus.ACTIVE) {
      filter.is_active = true;
    } else if (status === EnumPromptAIStatus.INACTIVE) {
      filter.is_active = false;
    }
    if (search) {
      filter.search = search;
    }
    if (category) {
      filter.category_obj_id = category;
    }
    const data = await PromptAIActions.findAllAndPaginated(filter);
    const count = await PromptAIActions.count(filter);
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
