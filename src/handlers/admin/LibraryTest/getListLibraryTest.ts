import LibraryTestAction from '@/actions/LibraryTestAction';
import { error, success, init, validateService } from '@/modules/core';

export const getListLibraryTest = validateService(async (event) => {
  await init();

  try {
    const { folder_id,type_id,level_id,creator_id, page_size, page_number } =
      event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };
    if (folder_id) {
        filter.folder_id = folder_id
    }
    if (type_id) {
        filter.type_id = type_id
    }
    if (level_id) {
        filter.level_id = level_id
    }
    if (folder_id) {
        filter.user = creator_id
    }

    const libTests = await LibraryTestAction.findAllAndPaginated(filter);
    const count = await LibraryTestAction.count(filter);
    const res_payload = {
      data: libTests,
      pagination: {
        total: count,
      },
    };
    return success({
      code: '10000',
      data: res_payload,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
