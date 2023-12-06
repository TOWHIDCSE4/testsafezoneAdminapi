import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';

export const createCategoryDomain = validateService(async (event) => {
  await init();
  const {
    category_id,
    host
  } = JSON.parse(event.body);

  try {
    const categoryExists = await CategoryDomain.findOne({
      $or: [{ category_id: category_id }],
    });


    if (categoryExists) {
      return error('Tên miền danh mục đã tồn tại');
    }
   
    const categoryDomain = await CategoryDomain.create({
      category_id: category_id,
      host: host
    });


   

    return success({
      code: '10000',
      data: categoryDomain,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
