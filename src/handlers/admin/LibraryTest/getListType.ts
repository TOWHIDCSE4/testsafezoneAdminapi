import { error, success, init, validateService } from '@/modules/core';
import { TypeModel } from '@/models/LibraryTestModel';

export const getListType = validateService(async () => {
  await init();
  
  try {
    const types = await TypeModel.find();

    return success({
      code: '10000',
      data: types,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
