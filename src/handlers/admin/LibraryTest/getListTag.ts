import { error, success, init, validateService } from '@/modules/core';
import { TagModel } from '@/models/LibraryTestModel/Tag';

export const getListTag = validateService(async () => {
  await init();
  
  try {
    const tags = await TagModel.find();

    return success({
      code: '10000',
      data: tags,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
