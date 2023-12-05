import { error, success, init, validateService } from '@/modules/core';
import { AdminModel } from '@/models/Admin';
import { AdminHasPermissionsModel } from '@/models/AdminHasPermissions';
import { AdminHasRolesModel } from '@/models/AdminHasRoles';

export const createEmployee = validateService(async (event) => {
  await init();
  const {
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
      $or: [{ username: username }, { email: email }],
    });

    if (adminExists) {
      return error('Tài khoản đã tồn tại');
    }

    const admin = await AdminModel.create({
      email: email,
      first_name: first_name,
      last_name: last_name,
      full_name: `${first_name} ${last_name}`,
      password: password,
      phone: phone,
      status: status,
      username: username,
    });

    for (const role_id of roles_id) {
      await AdminHasRolesModel.create({
        role_id: role_id,
        admin_id: admin._id,
      });
    }

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
