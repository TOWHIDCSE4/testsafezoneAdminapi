import { SubscriptionPlanModel } from '@/models/Subscription';
import { error, success, init, validateService } from '@/modules/core';

export const getNamesPlans = validateService(async () => {
  await init();

  try {
    const roles = await SubscriptionPlanModel.find({}, {});
    const res_payload = {
      data: roles,
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
