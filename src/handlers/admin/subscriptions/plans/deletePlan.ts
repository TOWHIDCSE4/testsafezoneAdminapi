import { error, success, init, validateService } from '@/modules/core';
import {
  SubscriptionModel,
  SubscriptionPlanModel,
} from '@/models/Subscription';

export const deletePlan = validateService(async (event) => {
  await init();
  const { plan_id } = JSON.parse(event.body);
  try {
    const subscription = await SubscriptionModel.findOne({
      plan: plan_id,
    });

    if (subscription) {
      return error('Plan đã được sử dụng. Không được phép xóa');
    }

    await SubscriptionPlanModel.deleteOne({ _id: plan_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
