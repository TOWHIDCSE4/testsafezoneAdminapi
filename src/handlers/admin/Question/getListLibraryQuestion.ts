import LibraryQuestionAction from '@/actions/LibraryQuestionAction';
import { error, success, init, validateService } from '@/modules/core';

export const getListLibraryQuestion = validateService(async (event) => {
  await init();

  try {
    const { question_type, page_size, page_number } =
      event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

  
    if (question_type && isNaN(Number(question_type))) {
        filter.question_type = question_type
    }


    const questions = await LibraryQuestionAction.findAllAndPaginated(filter);
    const count = await LibraryQuestionAction.count(filter);
    const res_payload = {
      data: questions,
      pagination: {
        total: count,
      },
    };
    return success({
      code: '10000',
      data: res_payload,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
