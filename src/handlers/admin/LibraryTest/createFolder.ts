import { error, success, init, validateService } from '@/modules/core';
import { FolderModel } from '@/models/LibraryTestModel';

export const createFolder = validateService(async (event) => {
  await init();
  const {
    name
  } = JSON.parse(event.body);

  try {
  
    const nameExists = await FolderModel.findOne({
      $or: [{ name: name }],
    });

    if (nameExists) {
      return error('Thư mục đã tồn tại');
    }
   
    const folder = await FolderModel.create({
      name:name
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
