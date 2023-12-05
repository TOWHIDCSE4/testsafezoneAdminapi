import { error, success, init, validateService } from '@/modules/core';
import { TemplateModel } from '@/models/Template';

export const updateTemplate = validateService(async (event) => {
  await init();
  try {
    const body = JSON.parse(event.body);
    const templateId = body.template_id;
    delete body.template_id;
    const diff = { ...body };
    console.log(diff);
    const template = await TemplateModel.findOne({ _id: templateId });
    if (!template) {
      return error('Template không tồn tại');
    }
    await TemplateModel.findOneAndUpdate(
      {
        _id: templateId,
      },
      {
        ...diff,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
