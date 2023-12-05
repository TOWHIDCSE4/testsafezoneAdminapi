import { error, success, init, validateService } from '@/modules/core';
import { ApiKeyAI, ApiKeyAIModel } from '@/models/AI';

export const updateApiKey = validateService(async (event) => {
  await init();
  const { obj_id, title, api_key, is_active } = JSON.parse(event.body);

  try {
    const data: any = {
      title,
      api_key,
    };
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const apiKey = await ApiKeyAIModel.findOne({ _id: obj_id });
    if (!apiKey) return error('Api key not found');

    const newApiKey = await ApiKeyAIModel.findOneAndUpdate(
      { _id: obj_id },
      data as ApiKeyAI
    );
    return success({
      code: '10000',
      data: newApiKey,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
