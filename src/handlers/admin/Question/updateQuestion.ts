import { error, success, init, validateService } from '@/modules/core';
import { QuestionModel } from '@/models/Question';

export const updateQuestion = validateService(async (event) => {
  await init();
  const {
    question_id,
    answers,
    audio,
    description,
    image,
    name,
    question_level,
    question_type,
    subject_id,
    video
  } = JSON.parse(event.body);

  try {
    const question = await QuestionModel.findOneAndUpdate(
      {
        _id: question_id,
      },
      {
        answers: answers,
        audio: audio,
        description: description,
        image: image,
        name: name,
        question_level: question_level,
        question_type: question_type,
        subject_id: subject_id,
        video: video
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: question,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
