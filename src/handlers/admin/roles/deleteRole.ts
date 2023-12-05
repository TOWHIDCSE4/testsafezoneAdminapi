import { error, success, init, validateService } from '@/modules/core';
import { RoleModel } from '@/models/Role';
import { RoleHasPermissionsModel } from '@/models/RoleHasPermissions';

export const deleteRole = validateService(async (event) => {
  await init();
  const { role_id } = JSON.parse(event.body);
  try {
    await RoleModel.deleteOne({ _id: role_id });
    await RoleHasPermissionsModel.deleteMany({ role_id: role_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
