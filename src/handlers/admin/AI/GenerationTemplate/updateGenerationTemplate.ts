import { error, success, init, validateService } from '@/modules/core';
import { GenerationTemplateAI, GenerationTemplateAIModel } from '@/models/AI/GenerationTemplateAI';

export const updateGenerationTemplate = validateService(async (event) => {
  await init();
  const { obj_id, is_active, job_is_active , job_frequency } = JSON.parse(event.body);

  try {
    const data: any = {
    };
    if (is_active === 'true' || is_active === true) {
      data.is_active = true;
    } else if (is_active === 'false' || is_active === false) {
      data.is_active = false;
    }
    if(job_is_active || job_is_active === false){
      data.job_is_active = job_is_active;
    }
    if(job_frequency){
      data.job_frequency = parseInt(job_frequency as string);
    }
    const GenerationTemplate = await GenerationTemplateAIModel.findOne({ _id: obj_id });
    if (!GenerationTemplate) return error('template not found');

    const newGenerationTemplate = await GenerationTemplateAIModel.findOneAndUpdate(
      { _id: obj_id },
      data as GenerationTemplateAI
    );
    return success({
      code: '10000',
      data: newGenerationTemplate,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
