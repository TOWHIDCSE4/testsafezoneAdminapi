import SubscriptionPlanActions from '@/actions/subscriptionPlans';
import { error, success, init, validateService } from '@/modules/core';

export const getSubscriptionPlans = validateService(async (event) => {
  await init();

  try {
    const { page_size, page_number, search } =
      event.queryStringParameters || {};
    const filter: any = {
      search: search ? (search as string) : '',
      page_size: parseInt(page_size as string),
      page_number: parseInt(page_number as string),
    };

    const subscriptionPlans = await SubscriptionPlanActions.findAllAndPaginated(
      filter
    );
    const count = await SubscriptionPlanActions.count(filter);
    const res_payload = {
      data: subscriptionPlans,
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
