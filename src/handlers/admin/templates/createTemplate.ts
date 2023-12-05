import { error, success, init, validateService } from '@/modules/core';
import { EnumTemplateType, TemplateModel } from '@/models/Template';

export const createTemplate = validateService(async (event) => {
  await init();
  try {
    const body = JSON.parse(event.body);
    const templateInfo = {
      ...body,
      type: body.type as EnumTemplateType,
    };

    await TemplateModel.create(templateInfo);

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
