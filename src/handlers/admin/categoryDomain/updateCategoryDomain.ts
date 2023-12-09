import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';
import axios from 'axios';

export const updateCategoryDomain = validateService(async (event) => {
  await init();
  const {
    category_domain_id,
    category_id,
    host
  } = JSON.parse(event.body);

  try {
    let url = host; 
    if(!host.startsWith('http://') || !host.startsWith('https://')){
      url= 'http://'+host;
    }
    const response = await axios.get(url);
    if(!(response.status >= 200 && response.status < 300)){
      return error('Máy chủ không thể truy cập được');
    }
    const categoryDomain = await CategoryDomain.findOneAndUpdate(
      {
        _id: category_domain_id,
      },
      {
        category_id: category_id,
        host: host
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return success({
      code: '10000',
      data: categoryDomain,
      message: 'Success',
    });
  } catch (e) {
    if(e.request || e.response){
      return error('Máy chủ không thể truy cập được');
    }
    return error(e);
  }
});
