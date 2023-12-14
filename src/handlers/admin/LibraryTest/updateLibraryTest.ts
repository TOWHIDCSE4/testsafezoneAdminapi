import { error, success, init, validateService } from '@/modules/core';
import { LibraryTestModel } from '@/models/LibraryTestModel';

export const updateLibraryTest = validateService(async (event) => {
  await init();
  const {
    test_id,
    topic,
    folder_id,
    type_id,
    level_id,
    status_id,
    test_time,
    creator_id
  } = JSON.parse(event.body);

  try {
    const libraryTest = await LibraryTestModel.findOneAndUpdate(
      {
        _id: test_id,
      },
      {
        topic: topic,
        folder: folder_id,
        type: type_id,
        level: level_id,
        status: status_id,
        test_time:test_time,
        user: creator_id
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: libraryTest,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
