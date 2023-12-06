import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';

export const updateCategoryDomain = validateService(async (event) => {
  await init();
  const {
    category_domain_id,
    category_id,
    host
  } = JSON.parse(event.body);

  try {

    const categoryDomain = await CategoryDomain.findOneAndUpdate(
      {
        _id: category_domain_id,
      },
      {
        category_id: category_id,
        host: host
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: categoryDomain,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
