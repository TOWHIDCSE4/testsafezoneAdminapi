import { error, success, init, validateService } from '@/modules/core';
import { ParentsSettingModel } from '@/models/ParentsSetting';

export const updateParentsSetting = validateService(async (event) => {
  await init();
  const {
    parents_setting_id,
    time,
    subject,
    quizes
  } = JSON.parse(event.body);

  try {

    var quiz= [];
    if(subject === 'Quiz'){
      quiz=quizes;
    }
    
    const parentsSetting = await ParentsSettingModel.findOneAndUpdate(
      {
        _id: parents_setting_id,
      },
      {
        time: time,
        subject: subject,
        quizes: quiz
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
