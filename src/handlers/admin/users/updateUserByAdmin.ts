import { error, success, init, validateService } from '@/modules/core';
import { adminUpdateUser } from '@/models/User/adminUpdateUser';
import { UserModel } from '@/models/User';

export const updateUserByAdmin = validateService(async (event) => {
  await init();
  const { user_id, password } = JSON.parse(event.body);
  let typeAccount = parseInt(JSON.parse(event.body).type as string);

  try {
    const user = await UserModel.findOne({
      _id: user_id,
    });
    if (user) {
      await adminUpdateUser({
        username: user.username,
        password,
      });

      if(typeAccount){
        await UserModel.findOneAndUpdate(
          {
            _id: user_id,
          },
          {
            type: typeAccount,
          },
          {
            new: true,
            runValidators: true,
          }
        );
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
