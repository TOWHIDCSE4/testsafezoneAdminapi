import { EnumTypeAccount, adminCreateUser, validation } from '@/models/User';
import { error, success, init, validateService } from '@/modules/core';

export const createUserByAdmin = validateService(async (event) => {
  await init();
  console.log(event.body);

  const { username, email, password } = JSON.parse(event.body);
  let typeAccount = parseInt(JSON.parse(event.body).type as string);
  const msg = await validation(username, email, password);
  if (msg) {
    return error(msg);
  }

  try {
    const { cognitoUser } = await adminCreateUser({
      username,
      email,
      password,
      type: typeAccount ?? EnumTypeAccount.Family
    });

    const userSub = cognitoUser.UserSub;

    return success({
      code: '10000',
      data: {
        codeDeliveryDetails: cognitoUser.CodeDeliveryDetails,
        sub: userSub,
        userConfirmed: cognitoUser.UserConfirmed,
      },
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
