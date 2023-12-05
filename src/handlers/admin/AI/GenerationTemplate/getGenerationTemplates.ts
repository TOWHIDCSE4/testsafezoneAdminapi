import GenerationTemplateAIActions from '@/actions/GenerationTemplateAI';
import { error, success, init, validateService } from '@/modules/core';

export const getGenerationTemplates = validateService(async (event) => {
  await init();

  try {
    const {
      page_size,
      page_number,
      title,
      prompt_name,
      age,
      category,
      subject,
      rank,
    } = event.queryStringParameters || {};
    // const status: any = parseInt(event.queryStringParameters.status as string);
    const filter: any = {
      page_number: Number(page_number || 1),
      page_size: Number(page_size || 10),
      title: title || null,
      prompt_name: prompt_name || null,
      age: age || null,
      category_obj_id: category || null,
      subject_obj_id: subject || null,
      rank_obj_id: rank || null,
    };
    // if (status === EnumTGenAIStatus.ACTIVE) {
    //   filter.is_active = true;
    // } else if (status === EnumTGenAIStatus.INACTIVE) {
    //   filter.is_active = false;
    // }
    const dataTemplate = await GenerationTemplateAIActions.findAllAndPaginated(
      filter,
      { createAt: -1 }
    );
    const res_payload: any = {
      data: null,
      pagination: {
        total: 0,
      },
    };
    if (dataTemplate && dataTemplate.length > 0) {
      res_payload.data = dataTemplate[0].data;
      res_payload.pagination = dataTemplate[0].pagination;
    }
    return success({
      code: '10000',
      data: res_payload,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
