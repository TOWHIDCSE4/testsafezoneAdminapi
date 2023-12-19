import { error, success, init, validateService } from '@/modules/core';
import { QuizModel } from '@/models/Quiz/Quiz';

export const createQuiz = validateService(async (event) => {
  await init();
  const {
    name,
    id
  } = JSON.parse(event.body);

  try {
  
    const nameExists = await QuizModel.findOne({
      $or: [{ name: name }],
    });

    if (nameExists) {
      return error('Thư mục đã tồn tại');
    }
   
    const folder = await QuizModel.create({
      name:name,
      id:id
    });


   

    return success({
      code: '10000',
      data: folder,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
