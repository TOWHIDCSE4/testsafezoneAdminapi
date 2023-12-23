import { QuestionModel } from '@/models/Question';
import { error, success, init, validateService } from '@/modules/core';

export const getQuestionForStudent = validateService(async (event) => {
  await init();

  try {
    const { subject_id } =
      event.queryStringParameters || {};
    const questions = await QuestionModel.find({subject_id:subject_id});
   
    return success({
      code: '10000',
      data: questions,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
