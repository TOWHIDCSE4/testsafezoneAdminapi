import { FilterQuery as FilterQueryMG, PipelineStage } from 'mongoose';
import { CategoryDomain } from '@/models/CategoryDomain';
import { escapeRegExp } from 'lodash';
import { WebCategories } from '@/models/WebCategories/WebCategories';

export default class CategoryDomainActions {
  public static buildFilterQuery(filter: any): FilterQueryMG<CategoryDomain> {
    const conditions: any = {};

    if (filter.search) {
      const searchRegexStr = escapeRegExp(filter.search);
      conditions.$or = [
        {
          host: {
            $regex: searchRegexStr,
            $options: 'i',
          },
        },
        {
          'category.name': {
            $regex: searchRegexStr,
            $options: 'i',
          },
        }
      ];
    }

    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = CategoryDomainActions.buildFilterQuery(filter);
    const pageSize = filter.page_size || 20;
    const pageNumber = filter.page_number || 1;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const matchPipeline: PipelineStage = {
      $match: conditions,
    };

    const pipelines = [];


    pipelines.push({
      $lookup: {
        from: WebCategories.collection.collectionName,
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      },
    });

    pipelines.push(matchPipeline);

    return await CategoryDomain.aggregate(pipelines).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = CategoryDomainActions.buildFilterQuery(filter);
    const countPipeline: PipelineStage = {
      $match: conditions,
    };
    const pipelines = [];


    pipelines.push({
      $lookup: {
        from: WebCategories.collection.collectionName,
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      },
    });

    pipelines.push(countPipeline);
    return CategoryDomain.aggregate(pipelines)
    .then((result) => result.length);
  }
}




