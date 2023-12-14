import { error, success, init, validateService } from '@/modules/core';
import { TagModel } from '@/models/LibraryTestModel/Tag';

export const createTag = validateService(async (event) => {
  await init();
  const {
    name
  } = JSON.parse(event.body);

  try {
  
    const nameExists = await TagModel.findOne({
      $or: [{ name: name }],
    });

    if (nameExists) {
      return error('Thư mục đã tồn tại');
    }
   
    const tag = await TagModel.create({
      name:name
    });

    return success({
      code: '10000',
      data: tag,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
