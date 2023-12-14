import { error, success, init, validateService } from '@/modules/core';
import { StatusModel } from '@/models/LibraryTestModel';

export const getListStatus = validateService(async () => {
  await init();
  
  try {
    const status = await StatusModel.find();

    return success({
      code: '10000',
      data: status,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
