import { CategoryDomain } from '@/models/CategoryDomain/CategoryDomain';
import { error, success, init, validateService } from '@/modules/core';
import axios from 'axios';


const insertIntoDatabase = async (lines,category_id) => {
    const arraysToInsert = [];
    lines.forEach(element => {
        if(element.startsWith("0")){
            const splitArr = element.split(" ");
            arraysToInsert.push({host:splitArr[1],category_id:category_id});
        }
    });
    await CategoryDomain.create(arraysToInsert);
  };


export const bulkInsertCategoryDomain = validateService(async (event) => {
  await init();
  const {
    url,
    category_id
  } = JSON.parse(event.body);

  try {

    const axiosResponse = await axios.request({
        method: "GET",
        url: url,
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const responseBody = axiosResponse.data;
    const lines = responseBody.split('\n');

    const chunkSize = 100;
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      await insertIntoDatabase(chunk,category_id);
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
