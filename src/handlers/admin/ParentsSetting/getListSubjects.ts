import { error, success, init, validateService } from '@/modules/core';
import { SubjectModel } from '@/models/Subject';

export const getListSubjects = validateService(async () => {
  await init();
  
  try {
    const subjects = await SubjectModel.find();

    return success({
      code: '10000',
      data: subjects,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
