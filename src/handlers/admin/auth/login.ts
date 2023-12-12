import { AdminModel } from '@/models/Admin';
import { AdminHasPermissionsModel } from '@/models/AdminHasPermissions';
import { AdminHasRolesModel } from '@/models/AdminHasRoles';
import { PermissionModel } from '@/models/Permission';
import { RoleHasPermissionsModel } from '@/models/RoleHasPermissions';
import { error, success, init, createHandler } from '@/modules/core';
import { createToken } from '@/utils/auth-utils';
import _ from 'lodash';

const ADMIN_SECRET: string = 'lDDWOyjntY3e7ItmngkkUxzqQBLpNbyPI1BixkVi0vxyu8vf8DeeSef2zh1Kf2jsai';
const LIBRARY_TEST_SECRET: string = 'uscx3e4s4DRjPWjvaS0bKJZ8TCUEcZORX2veOrBqYAN48GOcwXcIQ1c5ceeLbG20QX';

export const login = createHandler(async (event) => {
  await init();

  const { username, password } = JSON.parse(event.body);

  if (!username || !password)
    return error({
      message: 'Username or password is not provided',
    });

  try {
    const admin = await AdminModel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!admin) {
      return error('Đăng nhập không thành công');
    }

    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    const isDefaultPassword =
      defaultPassword && password && password === defaultPassword;

    const isMatch =
      isDefaultPassword || (await admin.comparePassword(password));
    if (!isMatch) {
      return error('Đăng nhập không thành công');
    }

    const access_token = await createToken(admin, ADMIN_SECRET);
    const library_test_token = await createToken(admin, LIBRARY_TEST_SECRET);

    const adminHasPermissions = await AdminHasPermissionsModel.find({
      admin_id: admin.id,
    });

    const adminHasRoles = await AdminHasRolesModel.find({
      admin_id: admin.id,
    });

    const permissionsId1 = adminHasPermissions.map((x: any) => x.permission_id);
    const rolesId = adminHasRoles.map((x: any) => x.role_id);
    const roleHasPermissions = await RoleHasPermissionsModel.find({
      role_id: { $in: rolesId },
    });
    const permissionsId2 = roleHasPermissions.map((x: any) => x.permission_id);

    const permissionsId = permissionsId1.concat(permissionsId2);

    const permissions = await PermissionModel.find({
      _id: { $in: permissionsId },
    });

    const permissionsCode = permissions.map((x: any) => x.permission_code);

    return success({
      code: '10000',
      data: {
        user: {
          ..._.pick(admin, [
            '_id',
            'id',
            'phone',
            'email',
            'username',
            'phone_number',
            'first_name',
            'last_name',
            'full_name',
            'gender',
            'avatar',
            'date_of_birth',
          ]),
          permissions: permissionsCode,
        },
        access_token,
        library_test_token
      },
      message: 'Login success',
    });
  } catch (e) {
    return error(e);
  }
});
