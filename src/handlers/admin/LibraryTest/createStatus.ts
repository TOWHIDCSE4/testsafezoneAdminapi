import { error, success, init, validateService } from '@/modules/core';
import { StatusModel } from '@/models/LibraryTestModel';

export const createStatus = validateService(async (event) => {
  await init();
  const {
    name
  } = JSON.parse(event.body);

  try {
  
    const nameExists = await StatusModel.findOne({
      $or: [{ name: name }],
    });

    if (nameExists) {
      return error('Thư mục đã tồn tại');
    }
   
    const folder = await StatusModel.create({
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
