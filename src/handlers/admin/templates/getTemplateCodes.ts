import { EmailTemplate } from '@/models/Template';
import { error, success, init, validateService } from '@/modules/core';

export const getTemplateCodes = validateService(async () => {
  await init();

  try {
    const EnumTemplateCode = {
      email: { ...EmailTemplate },
    };

    return success({
      code: '10000',
      data: EnumTemplateCode,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
