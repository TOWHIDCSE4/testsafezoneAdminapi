import { PromptParamAI, PromptParamAIModel } from '@/models/AI/PromptParamAI';
import { error, success, init, validateService } from '@/modules/core';

export const updatePromptParam = validateService(async (event) => {
  await init();
  const { obj_id, title, description, is_active } = JSON.parse(event.body);

  try {
    const data: any = {
      title,
      description,
    };
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const promptParam = await PromptParamAIModel.findOne({ _id: obj_id });
    if (!promptParam) return error('Api key not found');

    const newPromptParam = await PromptParamAIModel.findOneAndUpdate(
      { _id: obj_id },
      data as PromptParamAI
    );
    return success({
      code: '10000',
      data: newPromptParam,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
