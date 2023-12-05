import { SubscriptionPlanModel } from '@/models/Subscription';
import { createAuthorizedHandler, error, init, success } from '@/modules/core';

export const handler = createAuthorizedHandler(async () => {
  try {
    await init();

    const plans = await SubscriptionPlanModel.find().sort({
      level: 1,
    });

    return success({
      result: plans,
    });
  } catch (e) {
    return error(e);
  }
});
