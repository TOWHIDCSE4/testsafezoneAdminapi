import { CategoryDomain } from '@/models/CategoryDomain/CategoryDomain';
import { error, success, init, validateService } from '@/modules/core';
import axios from 'axios';


const processLine = async (line, category_id) => {
  if (line.startsWith("0")) {
    const splitArr = line.split(" ");
    const url = splitArr[1];
    const parts = url.split('.');
    let mainDomain = parts[parts.length - 2] + "." + parts[parts.length - 1];
    const domainExists = await CategoryDomain.findOne({
      $or: [{ domain: mainDomain }],
    });
    if(!domainExists){
      return { host: url, domain: mainDomain, category_id };
    }
    
  }
  return null;
};

const insertIntoDatabase = async (lines, category_id) => {
  const arraysToInsert = await Promise.all(
    lines.map(async (element) => await processLine(element, category_id))
  );
  const uniqueArraysToInsert = arraysToInsert.filter(Boolean).filter(
    (item, index, array) =>
      index === array.findIndex((i) => i.domain === item.domain)
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