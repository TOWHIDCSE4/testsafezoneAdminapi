import { error, success, init, validateService } from '@/modules/core';
import { PromptAI, PromptAIModel, PromptParamAIModel } from '@/models/AI';

export const createPrompt = validateService(async (event) => {
  await init();
  try {
    const { title, description, category, prompt, is_active } = JSON.parse(
      event.body
    );
    const dataCategory = await PromptParamAIModel.findOne({ _id: category });
    if (!dataCategory) {
      return error('category is not exists');
    }
    const data: any = {
      title,
      prompt,
      category_obj_id: dataCategory._id,
      category: dataCategory
    };
    if (description) {
      data.description = description;
    }
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const Prompt = await PromptAIModel.create(data as PromptAI);

    return success({
      code: '10000',
      data: Prompt,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
