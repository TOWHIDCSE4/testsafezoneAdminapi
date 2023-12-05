import { PromptParamAI, PromptParamAIModel } from '@/models/AI/PromptParamAI';
import { error, success, init, validateService } from '@/modules/core';

export const createPromptParam = validateService(async (event) => {
  await init();
  try {
    const { title, type, description, is_active } = JSON.parse(event.body);
    console.log(type);
    const data: any = {
      title,
      description,
      type: type ? Number(type) : null
    };
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const PromptParam = await PromptParamAIModel.create(
      data as PromptParamAI
    );

    return success({
      code: '10000',
      data: PromptParam,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
