import { error, success, init, validateService } from '@/modules/core';
import { ApiKeyAI, ApiKeyAIModel } from '@/models/AI';

export const createApiKey = validateService(async (event) => {
  await init();
  try {
    const { title, api_key, is_active } = JSON.parse(event.body);
    const data: any = {
      title,
      api_key,
      last_used_time: new Date().getTime(),
    };
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const apiKey = await ApiKeyAIModel.create(data as ApiKeyAI);

    return success({
      code: '10000',
      data: apiKey,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
