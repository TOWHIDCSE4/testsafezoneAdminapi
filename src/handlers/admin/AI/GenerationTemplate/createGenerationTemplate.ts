import { PromptAIModel, PromptParamAIModel } from '@/models/AI';
import { GenerationResultAIModel } from '@/models/AI/GenerationResultAI';
import {
  GenerationTemplateAI,
  GenerationTemplateAIModel,
} from '@/models/AI/GenerationTemplateAI';
import { error, success, init, validateService } from '@/modules/core';

export const createGenerationTemplate = validateService(async (event) => {
  await init();
  try {
    const {
      result_title,
      result_content,
      params,
      prompt_obj_id,
      category,
      age,
      subject,
      rank,
    } = JSON.parse(event.body);
    const dataPrompt = await PromptAIModel.findOne({
      _id: prompt_obj_id,
    });
    if (!dataPrompt) {
      return error('Prompt template is not exists');
    }
    let promptTemplate = dataPrompt.prompt;
    if (category && promptTemplate.indexOf('$[category]') !== -1) {
      const dataCategory = await PromptParamAIModel.findOne({
        _id: category,
      });
      if (!dataCategory) {
        return error('category is not exists');
      }
      promptTemplate = promptTemplate.replace(
        '$[category]',
        dataCategory.title
      );
    }
    if (age && promptTemplate.indexOf('$[age]') !== -1) {
      promptTemplate = promptTemplate.replace('$[age]', age);
    }
    if (subject && promptTemplate.indexOf('$[subject]') !== -1) {
      const dataSubject = await PromptParamAIModel.findOne({
        _id: subject,
      });
      if (!dataSubject) {
        return error('subject is not exists');
      }
      promptTemplate = promptTemplate.replace('$[subject]', dataSubject.title);
    }
    if (rank && promptTemplate.indexOf('$[rank]') !== -1) {
      const dataRank = await PromptParamAIModel.findOne({
        _id: rank,
      });
      if (!dataRank) {
        return error('rank is not exists');
      }
      promptTemplate = promptTemplate.replace('$[rank]', dataRank.title);
    }
    const data: any = {
      title: result_title,
      content: promptTemplate,
      prompt_obj_id,
      params,
      is_active: false,
      last_time_run_job: new Date(),
      job_is_active: false,
    };
    if (category) {
      data.category_obj_id = category;
    }
    if (age) {
      data.age = Number(age);
    }
    if (subject) {
      data.subject_obj_id = subject;
    }
    if (rank) {
      data.rank_obj_id = rank;
    }
    const template = await GenerationTemplateAIModel.create(
      data as GenerationTemplateAI
    );
    if (result_title && result_content && template) {
      await GenerationResultAIModel.create({
        template_obj_id: template?._id,
        title: result_title,
        content: result_content,
      });
    }

    return success({
      code: '10000',
      data: template,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
