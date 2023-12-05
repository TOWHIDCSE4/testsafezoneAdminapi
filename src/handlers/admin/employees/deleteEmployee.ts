import { error, success, init, validateService } from '@/modules/core';
import { AdminModel } from '@/models/Admin';
import { AdminHasPermissionsModel } from '@/models/AdminHasPermissions';
import { AdminHasRolesModel } from '@/models/AdminHasRoles';

export const deleteEmployee = validateService(async (event) => {
  await init();
  const { employee_id } = JSON.parse(event.body);
  try {
    await AdminModel.deleteOne({ _id: employee_id });
    await AdminHasRolesModel.deleteMany({ admin_id: employee_id });
    await AdminHasPermissionsModel.deleteMany({ admin_id: employee_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
