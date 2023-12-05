import { error, success, init, validateService } from '@/modules/core';
import dayjs from 'dayjs';
import { SubscriptionModel } from '@/models/Subscription';

export const updateSubscription = validateService(async (event) => {
  await init();

  const { subscription_id, plan, period, startDate, endDate } = JSON.parse(
    event.body
  );

  try {
    const data = {
      plan: plan,
      subscriptionPeriod: period,
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
    };

    await SubscriptionModel.findOneAndUpdate(
      {
        _id: subscription_id,
      },
      data,
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
