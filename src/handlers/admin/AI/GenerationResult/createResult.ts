import GenerationTemplateAIActions from '@/actions/GenerationTemplateAI';
import { GenerationResultAI, GenerationResultAIModel } from '@/models/AI/GenerationResultAI';
import { GenerationTemplateAIModel } from '@/models/AI/GenerationTemplateAI';
import { error, success, init, validateService } from '@/modules/core';

export const createResult = validateService(async (event) => {
  await init();
  try {
    const { template_id } = JSON.parse(event.body);
    const templateData: any = await GenerationTemplateAIModel.findOne({_id: template_id})
    if(!templateData){
      return error('Template not found');
    }
    let dataGenerate = await GenerationTemplateAIActions.generateAIResult(
      templateData.content,
      templateData.params
    );
    if (dataGenerate.statusCode > 300 || !dataGenerate) {
      return error(JSON.parse(dataGenerate.body).message);
    } else {
      dataGenerate = await dataGenerate.replace('\n\n', '</p> <p>');
    }
    const data: any = {
      template_obj_id: template_id,
      title : templateData.title,
      content: dataGenerate
    }
    const GenerationResult = await GenerationResultAIModel.create(
      data as GenerationResultAI
    );
    return success({
      code: '10000',
      data: GenerationResult,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
