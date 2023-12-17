import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';
import axios from 'axios';

const validateUrl = async (url:string)=>{
  try{
    const response = await axios.get(url);
    if(!(response.status >= 200 && response.status < 300)){
      return false;
    }
  }catch(e){
    return false
  }
 
  return true;
};

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
    if(!validateUrl(url)){
      return error('Máy chủ không thể truy cập được');
    }
    if(url.startsWith('http://')){
      url = url.replace('http://', '');
    }else if(url.startsWith('https://')){
      url = url.replace('https://','');
    }
    let parts = url.split('.');
    var domain = '';
    if(parts.length>1){
      let mainDomain = parts[parts.length-2]+"." + parts[parts.length-1];
      if(!validateUrl(mainDomain) && parts.length>2){
        mainDomain = parts[parts.length-3]+"." + mainDomain;
        if(!validateUrl(mainDomain) && parts.length>3){
          mainDomain = parts[parts.length-4]+"." + mainDomain;
        }
      }
      domain = mainDomain;
    }
    const categoryExists = await CategoryDomain.findOne({
      $or: [{ host: host }],
    });


    if (categoryExists) {
      return error('Tên miền danh mục đã tồn tại');
    }


    const domainExists = await CategoryDomain.findOne({
      $or: [{ domain: domain }],
    });


    if (domainExists) {
      return error('Tên miền danh mục đã tồn tại');
    }
   
    const categoryDomain = await CategoryDomain.create({
      category_id: category_id,
      host: host,
      domain:domain
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
