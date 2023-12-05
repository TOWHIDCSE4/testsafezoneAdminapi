import { error, success, init, validateService } from '@/modules/core';
import { RoleModel } from '@/models/Role';
import { RoleHasPermissionsModel } from '@/models/RoleHasPermissions';

export const createRole = validateService(async (event) => {
  await init();
  const { name, permissions_id } = JSON.parse(event.body);

  try {
    const role = await RoleModel.create({
      name: name,
    });

    for (const permission_id of permissions_id) {
      await RoleHasPermissionsModel.create({
        permission_id: permission_id,
        role_id: role._id,
      });
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
