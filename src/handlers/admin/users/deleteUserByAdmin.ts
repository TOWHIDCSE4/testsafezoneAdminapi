import { error, success, init, validateService } from '@/modules/core';
import { UserModel } from '@/models/User';
import { ChildModel } from '@/models/Child';
import { removeUser } from '@/models/User/removeUser';
import { DeviceModel } from '@/models/Device';
import { SubscriptionModel } from '@/models/Subscription';
import { ActivityModel } from '@/models/Child/Activity';
import {
  ActivityControlRuleModel,
  DailyTimeLimitRuleModel,
  RestrictedTimeRuleModel,
  WebFilteringRuleModel,
} from '@/models/Rule';
import { OrderModel } from '@/models/Order';

export const deleteUserByAdmin = validateService(async (event) => {
  await init();
  const { user_id } = JSON.parse(event.body);
  try {
    const user = await UserModel.findOne({
      _id: user_id,
    });
    if (user) {
      await removeUser(user.username);
      await UserModel.deleteOne({ _id: user_id });
      await ChildModel.deleteMany({ parentId: user_id });
      await DeviceModel.deleteMany({ userId: user_id });
      await SubscriptionModel.deleteMany({ user: user_id });
      await OrderModel.deleteMany({ userId: user_id });

      const listChildren = await ChildModel.find({
        parentId: user_id,
      });
      const childrenIds = listChildren.map((e) => e._id);
      if (childrenIds?.length > 0) {
        await ActivityModel.deleteMany({ childId: { $in: childrenIds } });
        await ActivityControlRuleModel.deleteMany({
          childId: { $in: childrenIds },
        });
        await DailyTimeLimitRuleModel.deleteMany({
          childId: { $in: childrenIds },
        });
        await RestrictedTimeRuleModel.deleteMany({
          childId: { $in: childrenIds },
        });
        await WebFilteringRuleModel.deleteMany({
          childId: { $in: childrenIds },
        });
      }
    }

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
