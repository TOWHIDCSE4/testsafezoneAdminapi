import { error, success, init, validateService } from '@/modules/core';
import { ParentsSettingModel } from '@/models/ParentsSetting';


export const createParentsSetting = validateService(async (event) => {
  await init();
  const {
    time,
    subject,
    quizes
  } = JSON.parse(event.body);

  try {
    var quiz= [];
    if(subject === 'Quiz'){
      quiz=quizes;
    }
   
    const parentsSetting = await ParentsSettingModel.create({
      time: time,
      subject:subject,
      quizes:quiz
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
