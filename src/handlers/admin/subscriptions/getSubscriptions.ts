import SubscriptionActions from '@/actions/subscriptions';
import { error, success, init, validateService } from '@/modules/core';

export const getSubscriptions = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, start_date, end_date } =
      event.queryStringParameters || {};
    const filter: any = {
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    if (start_date && end_date) {
      filter.startDate = {
        $gte: new Date(start_date),
      };
      filter.endDate = {
        $lte: new Date(end_date),
      };
    }

    const subscriptions = await SubscriptionActions.findAllAndPaginated(filter);
    const count = await SubscriptionActions.count(filter);
    const res_payload = {
      data: subscriptions,
      pagination: {
        total: count,
      },
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
