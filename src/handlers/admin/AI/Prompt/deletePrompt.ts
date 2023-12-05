import { error, success, init, validateService } from '@/modules/core';
import { PromptAIModel } from '@/models/AI';

export const deletePrompt = validateService(async (event) => {
  await init();
  const { obj_id } = JSON.parse(event.body);
  try {
    await PromptAIModel.deleteOne({ _id: obj_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
