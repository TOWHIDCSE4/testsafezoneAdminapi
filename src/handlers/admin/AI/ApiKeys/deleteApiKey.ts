import { error, success, init, validateService } from '@/modules/core';
import { ApiKeyAIModel } from '@/models/AI';

export const deleteApiKey = validateService(async (event) => {
  await init();
  const { obj_id } = JSON.parse(event.body);
  try {
    await ApiKeyAIModel.deleteOne({ _id: obj_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
