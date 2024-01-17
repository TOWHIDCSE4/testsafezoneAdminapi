import { CategoryDomain } from '@/models/CategoryDomain/CategoryDomain';
import { error, success, init, validateService } from '@/modules/core';
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
  if (prevIndex < 1) {
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


const processLine = async (line, category_id) => {
  if (line.startsWith("0")) {
    const splitArr = line.split(" ");
    const url = splitArr[1];
    const parts = url.split('.');
    let prevIndex = parts.length -1;
    const domain = await validateDomainRecursively(parts,parts[prevIndex],prevIndex);
    if(!domain){
      return null;
    }
    const domainExists = await CategoryDomain.findOne({
      $or: [{ domain: domain }],
    });
    if(!domainExists){
      return { host: url, domain: domain, category_id: category_id};
    }
    
  }
  return null;
};

const insertIntoDatabase = async (lines, category_id) => {
  const arraysToInsert = await Promise.all(
    lines.map(async (element) => await processLine(element, category_id))
  );
  const uniqueArraysToInsert = arraysToInsert.filter(Boolean).filter(
    (item:CategoryDomain, index, array:CategoryDomain[]) =>
      index === array.findIndex((i:CategoryDomain) => i.domain === item.domain)
  );
  await CategoryDomain.create(uniqueArraysToInsert);
};

export const bulkInsertCategoryDomain = validateService(async (event) => {
  await init();
  const { url, category_id } = JSON.parse(event.body);

  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: url,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });

    const responseBody = axiosResponse.data;
    const lines = responseBody.split('\n');

    const chunkSize = 100;
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      await insertIntoDatabase(chunk, category_id);
    }

    return success({
      code: '10000',
      data: {},
      message: 'Success',
    });
  } catch (e) {
    return error(e);
  }
});