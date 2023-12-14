import { error, success, init, validateService } from '@/modules/core';
import { LevelModel } from '@/models/LibraryTestModel';

export const getListLevel = validateService(async () => {
  await init();
  
  try {
    const levels = await LevelModel.find();

    return success({
      code: '10000',
      data: levels,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
