import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';
import { WebCategories } from '@/models/WebCategories';

export const CategoryFindingDomain = validateService(async (event) => {
  await init();
  const {
    host
  } = JSON.parse(event.body);

  try {
    const categoryDomain = await CategoryDomain.findOne({
      $or: [{ host: host }],
    });

    if (!categoryDomain) {
      return error('Không tìm thấy danh mục với máy chủ- ' + host);
    }

    const category_id:number = JSON.parse(categoryDomain.category_id);

    const category = await WebCategories.findOne({
      $or: [{ _id: category_id }],
    });

    const data= {
      domain:categoryDomain,
      category:category
    }

    return success({
      code: '10000',
      data: data,
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});
