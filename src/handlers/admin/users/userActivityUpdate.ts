import { error, success, init, validateService } from '@/modules/core';
import { UserModel } from '@/models/User';

export const userActivityUpdate = validateService(async (event) => {
  await init();

  const { user_id, active } = JSON.parse(event.body);

  try {
    await UserModel.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        active: active,
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
