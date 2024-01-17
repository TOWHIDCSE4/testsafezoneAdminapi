import { error, success, init, validateService } from '@/modules/core';
import { CategoryDomain } from '@/models/CategoryDomain';
import axios from 'axios';

const validateUrl = async (url) => {
  try {
    const response = await axios.get(url);
    return response.status >= 200 && response.status < 300;
  } catch (e) {
    return false;
  }
};

const validateDomainRecursively = async (parts:string[], mainDomain:string, prevIndex:number) =>{
  if (prevIndex < 0) {
    return null;
  }
  mainDomain = parts[prevIndex-1].concat('.',mainDomain);
  const url = 'http://' + mainDomain;
  const isValid = await validateUrl(url);
  if(isValid){
    return mainDomain;
  }else{
    return validateDomainRecursively(parts,mainDomain,prevIndex-1);
  }

};

const getCategoryDomain = async (hostUrl:string)=>{
  let url = hostUrl;
  if(!hostUrl.startsWith('http://') || !hostUrl.startsWith('https://')){
      url= 'http://'+hostUrl;
    }

  if(!validateUrl(url)){
    return null;
  }

  if(url.startsWith('http://')){
    url = url.replace('http://', '');
  }else if(url.startsWith('https://')){
    url = url.replace('https://','');
  }

  let parts = url.split('.');

  if(parts.length<2){
    return null;
  }
  let prevIndex = parts.length -1;
  let mainDomain = parts[prevIndex];
  const domain = await validateDomainRecursively(parts,mainDomain,prevIndex);
  return{domain,hostUrl};

};

export const createCategoryDomain = validateService(async (event) => {
  await init();
  const {
    category_id,
    host
  } = JSON.parse(event.body);

  try {
    const hostDomain = await getCategoryDomain(host);
    if(!hostDomain || !hostDomain.domain){
      return error('Máy chủ không thể truy cập được');
    }
   
    const categoryExists = await CategoryDomain.findOne({
      $or: [{ host: hostDomain.hostUrl }],
    });


    if (categoryExists) {
      return error('Tên miền danh mục đã tồn tại');
    }


    const domainExists = await CategoryDomain.findOne({
      $or: [{ domain: hostDomain.domain }],
    });


    if (domainExists) {
      return error('Tên miền danh mục đã tồn tại');
    }
   
    const categoryDomain = await CategoryDomain.create({
      category_id: category_id,
      host: hostDomain.hostUrl,
      domain:hostDomain.domain
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
