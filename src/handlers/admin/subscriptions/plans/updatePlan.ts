import { error, success, init, validateService } from '@/modules/core';
import { SubscriptionPlanModel } from '@/models/Subscription';

export const updatePlan = validateService(async (event) => {
  await init();
  const {
    plan_id,
    name,
    code,
    total_use_days,
    total_devices,
    yearly_price,
    monthly_price,
    is_free,
  } = JSON.parse(event.body);
  let typePlan = parseInt(JSON.parse(event.body).type);

  try {
    await SubscriptionPlanModel.findOneAndUpdate(
      {
        _id: plan_id,
      },
      {
        name: name,
        code: code,
        totalUseDays: total_use_days,
        totalDevices: total_devices,
        yearlyPrice: yearly_price,
        monthlyPrice: monthly_price,
        isFree: is_free,
        type: typePlan
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
