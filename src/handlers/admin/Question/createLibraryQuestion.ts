import { error, success, init, validateService } from '@/modules/core';
import { LibraryQuestionModel } from '@/models/LibraryQuestion';


export const createLibraryQuestion = validateService(async (event) => {
  await init();
  const {
    result_title,
    result_content,
    params,
    category,
    age,
    subject
  } = JSON.parse(event.body);

  try {

    const question = await LibraryQuestionModel.create({
        answers: null,
        audio: '',
        description: result_content,
        result_content: result_content,
        image: '',
        name: result_title,
        category: category,
        age: age,
        params:params,
        subject_id:subject,
        video: '',
        correct_answer: null,
        incorrect_answer: null
    });

    return success({
      code: '10000',
      data: question,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
