import { error, success, init, validateService } from '@/modules/core';
import { LibraryQuestionModel } from '@/models/LibraryQuestion';

export const deleteLibraryQuestion = validateService(async (event) => {
  await init();
  const { id } = JSON.parse(event.body);
  try {
    await LibraryQuestionModel.deleteOne({ _id: id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
