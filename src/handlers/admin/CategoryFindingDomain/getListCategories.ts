import { error, success, init, validateService } from '@/modules/core';
import { WebCategories } from '@/models/WebCategories';

export const getListCategories = validateService(async () => {
  await init();
  
  try {
    const domains = await WebCategories.find();

    return success({
      code: '10000',
      data: domains,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
