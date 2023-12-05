import { createHandler, error, success } from '@/modules/core';
import { signIn } from '@/models/User/signIn';

export const login = createHandler(async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password)
    return error({
      message: 'Username or password is not provided',
    });

  try {
    const result = await signIn(username, password);

    return success(result);
  } catch (e) {
    return error(e);
  }
});
