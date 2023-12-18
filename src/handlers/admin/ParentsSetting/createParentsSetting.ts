import { error, success, init, validateService } from '@/modules/core';
import { ParentsSettingModel } from '@/models/ParentsSetting';


export const createParentsSetting = validateService(async (event) => {
  await init();
  const {
    time,
    subject
  } = JSON.parse(event.body);

  try {
   
    const parentsSetting = await ParentsSettingModel.create({
      time: time,
      subject:subject
    });


   

    return success({
      code: '10000',
      data: parentsSetting,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});