import { error, success, init, validateService } from '@/modules/core';
import dayjs from 'dayjs';
import { SubscriptionModel } from '@/models/Subscription';

export const createSubscription = validateService(async (event) => {
  await init();
  console.log(event.body);

  const { active, plan, user, period, startDate, endDate } = JSON.parse(
    event.body
  );

  try {
    const subscription = await SubscriptionModel.findOne({
      user: user,
    });

    if (subscription) {
      return error('Người dùng đã đăng ký');
    }

    await SubscriptionModel.create({
      active: active,
      plan: plan,
      user: user,
      subscriptionPeriod: period,
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
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
