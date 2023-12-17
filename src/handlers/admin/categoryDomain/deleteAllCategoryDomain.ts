import { CategoryDomain } from '@/models/CategoryDomain/CategoryDomain';
import { error, success, init, validateService } from '@/modules/core';

export const deleteAllCategoryDomain = validateService(async () => {
  await init();

  try {
    await CategoryDomain.deleteMany();
    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
