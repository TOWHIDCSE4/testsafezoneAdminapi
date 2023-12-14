import { error, success, init, validateService } from '@/modules/core';
import { LibraryTestModel } from '@/models/LibraryTestModel';

export const deleteLibraryTest = validateService(async (event) => {
  await init();
  const { test_id } = JSON.parse(event.body);
  try {
    await LibraryTestModel.deleteOne({ _id: test_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
