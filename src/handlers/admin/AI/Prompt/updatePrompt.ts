import { error, success, init, validateService } from '@/modules/core';
import { PromptAI, PromptAIModel, PromptParamAIModel } from '@/models/AI';

export const updatePrompt = validateService(async (event) => {
  await init();
  const { obj_id, title, description, category, prompt, is_active } =
    JSON.parse(event.body);

  try {
    const PromptTemplate: any = await PromptAIModel.findOne({ _id: obj_id });
    const data: any = {
      title,
      description,
      prompt,
    };
    if (category !== PromptTemplate.category_obj_id) {
      const dataCategory = await PromptParamAIModel.findOne({
        _id: category,
      });
      if (!dataCategory) {
        return error('category is not exists');
      }
      data.category_obj_id = dataCategory._id;
    }
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    const dataUpdate = await PromptAIModel.findOneAndUpdate(
      { _id: obj_id },
      data as PromptAI
    );
    return success({
      code: '10000',
      data: dataUpdate,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
