import { error, success, init, validateService } from '@/modules/core';
import { ParentsSettingModel } from '@/models/ParentsSetting';

export const updateParentsSetting = validateService(async (event) => {
  await init();
  const {
    parents_setting_id,
    time,
    subject
  } = JSON.parse(event.body);

  try {
    
    const parentsSetting = await ParentsSettingModel.findOneAndUpdate(
      {
        _id: parents_setting_id,
      },
      {
        time: time,
        subject: subject
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: parentsSetting,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
