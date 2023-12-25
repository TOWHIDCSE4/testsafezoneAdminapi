import GenerationTemplateAIActions from '@/actions/GenerationTemplateAI';
import { PromptAIModel } from '@/models/AI';
import { SubjectModel } from '@/models/Subject/Subject';
import { error, success, init, validateService } from '@/modules/core';

export const generateQuestion = validateService(async (event) => {
  await init();
  try {
    const { params, category, age, subject } = JSON.parse(
      event.body
    );
    const dataPrompt = await PromptAIModel.findOne({
      _id: '655b07e5942f0ab5e83e1c74',
    });
    if (!dataPrompt) {
      return error('Prompt template is not exists');
    }
    let promptTemplate = dataPrompt.prompt;
    if (category && promptTemplate.indexOf('$[category]') !== -1) {
      promptTemplate = promptTemplate.replace(
        '$[category]',
        category
      );
    }
    if (age && promptTemplate.indexOf('$[age]') !== -1) {
      promptTemplate = promptTemplate.replace('$[age]', age);
    }
    if (subject && promptTemplate.indexOf('$[subject]') !== -1) {
      const dataSubject = await SubjectModel.findOne({
        _id: subject,
      });
      if (!dataSubject) {
        return error('subject is not exists');
      }
      promptTemplate = promptTemplate.replace(
        '$[subject]',
        dataSubject.name
      );
    }
    promptTemplate = promptTemplate.replace(
        '$[rank]',
        'Tiếng Việt'
      );
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
