import { RoleModel } from '@/models/Role';
import { error, success, init, validateService } from '@/modules/core';

export const getNamesRoles = validateService(async () => {
  await init();

  try {
    const roles = await RoleModel.find({}, {});
    const res_payload = {
      data: roles,
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
