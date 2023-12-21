import { error, success, init, validateService } from '@/modules/core';
import { QuestionModel } from '@/models/Question/QuestionModel';

export const deleteQuestion = validateService(async (event) => {
  await init();
  const { id } = JSON.parse(event.body);
  try {
    await QuestionModel.deleteOne({ _id: id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
