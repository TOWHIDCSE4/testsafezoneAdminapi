import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';
import axios from 'axios';

export const createCategoryDomain = validateService(async (event) => {
  await init();
  const {
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
    const categoryExists = await CategoryDomain.findOne({
      $or: [{ host: host }],
    });


    if (categoryExists) {
      return error('Tên miền danh mục đã tồn tại');
    }
   
    const categoryDomain = await CategoryDomain.create({
      category_id: category_id,
      host: host
    });


   

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
