import { error, success, init, validateService } from '@/modules/core';
import { QuizModel } from '@/models/Quiz/Quiz';

export const getListQuizes = validateService(async () => {
  await init();
  
  try {
    const quizes = await QuizModel.find();

    return success({
      code: '10000',
      data: quizes,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
