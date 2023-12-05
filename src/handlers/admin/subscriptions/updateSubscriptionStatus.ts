import { error, success, init, validateService } from '@/modules/core';
import dayjs from 'dayjs';
import { SubscriptionModel } from '@/models/Subscription';

export const updateSubscriptionStatus = validateService(async (event) => {
  await init();
  console.log(event.body);

  const { _id, active } = JSON.parse(event.body);

  try {
    const data = { active: active };
    const subscription = await SubscriptionModel.findOne({
      _id: _id,
    });
    if (active && subscription?.startDate && subscription?.endDate) {
      const startDate = dayjs();
      const endDate = startDate.clone().add(1, 'year');
      data['startDate'] = startDate;
      data['endDate'] = endDate;
    }

    await SubscriptionModel.findOneAndUpdate(
      {
        _id: _id,
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
