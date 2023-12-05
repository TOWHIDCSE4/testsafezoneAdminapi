import { error, success, init, validateService } from '@/modules/core';
import { GenerationResultAI, GenerationResultAIModel } from '@/models/AI/GenerationResultAI';

export const updateResult = validateService(async (event) => {
  await init();
  const { obj_id, title, content } = JSON.parse(event.body);

  try {
    const data: any = {
      title,
    };
    if(content){
      data.content = content
    }
    const GenerationResult = await GenerationResultAIModel.findOne({ _id: obj_id });
    if (!GenerationResult) return error('result not found');

    const newGenerationResult = await GenerationResultAIModel.findOneAndUpdate(
      { _id: obj_id },
      data as GenerationResultAI
    );
    return success({
      code: '10000',
      data: newGenerationResult,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
