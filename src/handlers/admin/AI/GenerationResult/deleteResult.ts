import { error, success, init, validateService } from '@/modules/core';
import { GenerationResultAIModel } from '@/models/AI/GenerationResultAI';

export const deleteResult = validateService(async (event) => {
  await init();
  const { obj_id } = JSON.parse(event.body);
  try {
    await GenerationResultAIModel.deleteOne({ _id: obj_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
