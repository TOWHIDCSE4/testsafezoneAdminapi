import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';

export const deleteCategoryDomain = validateService(async (event) => {
  await init();
  const { category_domain_id } = JSON.parse(event.body);
  try {
    await CategoryDomain.deleteOne({ _id: category_domain_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
