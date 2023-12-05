import PermissionActions from '@/actions/permission';
import { error, success, init, validateService } from '@/modules/core';

export const getPermissions = validateService(async () => {
  await init();

  try {
    const permissions = await PermissionActions.getPermissionsByModule({});
    const res_payload = {
      data: permissions,
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
