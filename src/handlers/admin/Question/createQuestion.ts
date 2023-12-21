import { error, success, init, validateService } from '@/modules/core';
import { QuestionModel } from '@/models/Question';

export const createQuestion = validateService(async (event) => {
  await init();
  const {
    answers,
    audio,
    description,
    image,
    name,
    question_level,
    question_type,
    video
  } = JSON.parse(event.body);

  try {

    const questionExists = await QuestionModel.findOne({
      $or: [{ name: name }],
    });


    if (questionExists) {
      return error('Tên câu hỏi tồn tại');
    }
   
    const question = await QuestionModel.create({
        answers: answers,
        audio: audio,
        description: description,
        image: image,
        name: name,
        question_level: question_level,
        question_type: question_type,
        video: video
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
