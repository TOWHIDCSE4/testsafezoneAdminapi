import { error, success, init, validateService } from '@/modules/core';
import { EnumTypePlan, SubscriptionPlanModel } from '@/models/Subscription';

export const createPlan = validateService(async (event) => {
  await init();
  const {
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
    const plan = await SubscriptionPlanModel.findOne({}).sort({ level: -1 });
    const levelUp = plan?.level ? plan?.level + 1 : 1;
    await SubscriptionPlanModel.create({
      name: name,
      code: code,
      totalUseDays: total_use_days,
      limitedFeatures: [],
      totalDevices: total_devices,
      yearlyPrice: yearly_price,
      monthlyPrice: monthly_price,
      isFree: is_free,
      isFeatured: false,
      level: levelUp,
      type: typePlan ?? EnumTypePlan.Family
    });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
