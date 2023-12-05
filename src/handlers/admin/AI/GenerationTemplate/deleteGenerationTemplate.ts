import { GenerationTemplateAIModel } from '@/models/AI/GenerationTemplateAI';
import { error, success, init, validateService } from '@/modules/core';

export const deleteGenerationTemplate = validateService(async (event) => {
  await init();
  const { obj_id } = JSON.parse(event.body);
  try {
    await GenerationTemplateAIModel.deleteOne({ _id: obj_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
