import { error, success, init, validateService } from '@/modules/core';
import { FolderModel } from '@/models/LibraryTestModel';

export const getListFolder = validateService(async () => {
  await init();
  
  try {
    const folders = await FolderModel.find();

    return success({
      code: '10000',
      data: folders,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
