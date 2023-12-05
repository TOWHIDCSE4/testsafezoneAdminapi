import { error, success, init, validateService } from '@/modules/core';
import { TemplateModel } from '@/models/Template';

export const removeTemplate = validateService(async (event) => {
  await init();
  const { template_id } = JSON.parse(event.body);
  try {
    await TemplateModel.deleteOne({ _id: template_id });

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
