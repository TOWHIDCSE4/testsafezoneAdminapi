import { error, success, init, validateService } from '@/modules/core';
import { RoleModel } from '@/models/Role';
import { RoleHasPermissionsModel } from '@/models/RoleHasPermissions';

export const updateRole = validateService(async (event) => {
  await init();
  const { role_id, name, permissions_id } = JSON.parse(event.body);

  try {
    const role = await RoleModel.findOneAndUpdate(
      {
        _id: role_id,
      },
      {
        name: name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await RoleHasPermissionsModel.deleteMany({ role_id: role_id });
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
