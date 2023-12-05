import { error, success, init, validateService } from '@/modules/core';
import { AdminModel } from '@/models/Admin';
import { AdminHasPermissionsModel } from '@/models/AdminHasPermissions';
import { AdminHasRolesModel } from '@/models/AdminHasRoles';

export const updateEmployee = validateService(async (event) => {
  await init();
  const {
    admin_id,
    email,
    first_name,
    last_name,
    password,
    phone,
    roles_id,
    status,
    username,
    permissions_id,
  } = JSON.parse(event.body);

  try {
    const adminExists = await AdminModel.findOne({
      _id: { $ne: admin_id },
      $or: [{ username: username }, { email: email }],
    });

    if (adminExists) {
      return error('Tài khoản đã tồn tại');
    }

    const admin = await AdminModel.findOneAndUpdate(
      {
        _id: admin_id,
      },
      {
        email: email,
        first_name: first_name,
        last_name: last_name,
        full_name: `${first_name} ${last_name}`,
        password: password,
        phone: phone,
        status: status,
        username: username,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await AdminHasRolesModel.deleteMany({ admin_id: admin_id });
    for (const role_id of roles_id) {
      await AdminHasRolesModel.create({
        role_id: role_id,
        admin_id: admin._id,
      });
    }

    await AdminHasPermissionsModel.deleteMany({ admin_id: admin_id });
    for (const permission_id of permissions_id) {
      await AdminHasPermissionsModel.create({
        permission_id: permission_id,
        admin_id: admin._id,
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
