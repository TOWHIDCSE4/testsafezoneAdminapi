import { error, success, init, validateService } from '@/modules/core';
import { ParentsSettingModel } from '@/models/ParentsSetting';

export const deleteParentsSetting = validateService(async (event) => {
  await init();
  const { parent_setting_id } = JSON.parse(event.body);
  try {
    await ParentsSettingModel.deleteOne({ _id: parent_setting_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
