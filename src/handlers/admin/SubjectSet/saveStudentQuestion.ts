import { error, success, init, validateService } from '@/modules/core';
import { StudentAnswerModel } from '@/models/StudentAnswer';

export const saveStudentQuestion = validateService(async (event) => {
  try {
    await init();

    const body = JSON.parse(event.body || '{}');
    
    const { studentAnswers } = body;

    if (!Array.isArray(studentAnswers)) {
      throw new Error('Invalid or missing studentAnswers array.');
    }

    const insertedAnswers = await Promise.all(
      studentAnswers.map(async (answer) => {
        const {
          question_id,
          question_level,
          question_type,
          selected_answer,
          user_id,
          subject_id,
          is_correct,
        } = answer;

        const ans = await StudentAnswerModel.create({
          question_id,
          question_level,
          question_type,
          selected_answer,
          user_id,
          subject_id,
          is_correct,
        });

        return ans;
      })
    );

    return success({
      code: '10000',
      data: insertedAnswers,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
