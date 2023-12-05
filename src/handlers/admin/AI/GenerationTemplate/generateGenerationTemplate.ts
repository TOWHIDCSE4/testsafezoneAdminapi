import GenerationTemplateAIActions from '@/actions/GenerationTemplateAI';
import { PromptAIModel, PromptParamAIModel } from '@/models/AI';
import { error, success, init, validateService } from '@/modules/core';

export const generateGenerationTemplate = validateService(async (event) => {
  await init();
  try {
    const { params, prompt_obj_id, category, age, subject, rank } = JSON.parse(
      event.body
    );
    const dataPrompt = await PromptAIModel.findOne({
      _id: prompt_obj_id,
    });
    if (!dataPrompt) {
      return error('Prompt template is not exists');
    }
    let promptTemplate = dataPrompt.prompt;
    if (category && promptTemplate.indexOf('$[category]') !== -1) {
      const dataCategory = await PromptParamAIModel.findOne({ _id: category });
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
      promptTemplate = promptTemplate.replace(
        '$[subject]',
        dataSubject.title
      );
    }
    if (rank && promptTemplate.indexOf('$[rank]') !== -1) {
      const dataRank = await PromptParamAIModel.findOne({
        _id: rank,
      });
      if (!dataRank) {
        return error('rank is not exists');
      }
      promptTemplate = promptTemplate.replace(
        '$[rank]',
        dataRank.title
      );
    }
    let dataGenerate = await GenerationTemplateAIActions.generateAIResult(
      promptTemplate,
      params
    );
    if (dataGenerate.statusCode > 300 || !dataGenerate) {
      return error(JSON.parse(dataGenerate.body).message);
    } else {
      dataGenerate = await dataGenerate.replace('\n\n', '</p> <p>');
    }
    return success({
      code: '10000',
      data: dataGenerate,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
