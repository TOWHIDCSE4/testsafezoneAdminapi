import QuestionAction from '@/actions/QuestionAction';
import { error, success, init, validateService } from '@/modules/core';

export const getListQuestion = validateService(async (event) => {
  await init();

  try {
    const { name,question_type, question_level, page_size, page_number } =
      event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    if (name) {
      filter.name = name
    }
    if (question_type) {
        filter.question_type = Number(question_type)
    }
    if (question_level) {
        filter.level_id = Number(question_level)
    }

    const questions = await QuestionAction.findAllAndPaginated(filter);
    const count = await QuestionAction.count(filter);
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
