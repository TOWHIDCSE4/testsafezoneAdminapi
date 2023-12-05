import PromptParamAIActions from '@/actions/PromptParamAI';
import { EnumPromptParamAIStatus } from '@/models/AI/PromptParamAI';
import { error, success, init, validateService } from '@/modules/core';

export const getPromptParams = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, type, search } =
      event.queryStringParameters || {};
    const status: any = parseInt(event.queryStringParameters.status as string);
    const filter: any = {
      page_number: Number(page_number || 1),
      page_size: Number(page_size || 10),
    };
    if (status === EnumPromptParamAIStatus.ACTIVE) {
      filter.is_active = true;
    } else if (status === EnumPromptParamAIStatus.INACTIVE) {
      filter.is_active = false;
    }
    if (type) {
      filter.type = Number(type);
    }
    if (search) {
      filter.search = search;
    }
    const data = await PromptParamAIActions.findAllAndPaginated(filter);
    const count = await PromptParamAIActions.count(filter);
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
