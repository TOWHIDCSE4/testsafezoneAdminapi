import { FilterQuery as FilterQueryMG, PipelineStage } from 'mongoose';
import { escapeRegExp } from 'lodash';
import { QuizModel } from '@/models/Quiz';
import { ParentsSetting, ParentsSettingModel } from '@/models/ParentsSetting';

export default class ParentsSettingAction {
  public static buildFilterQuery(filter: any): FilterQueryMG<ParentsSetting> {
    const conditions: any = {};

    if (filter.search) {
      const searchRegexStr = escapeRegExp(filter.search);
      conditions.$or = [
        {
          subject: {
            $regex: searchRegexStr,
            $options: 'i',
          },
        }
      ];
    }

    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = ParentsSettingAction.buildFilterQuery(filter);
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
        from: QuizModel.collection.collectionName,
        localField: 'quizes',
        foreignField: '_id',
        as: 'quiz', 
      },
    });


    // pipelines.push({
    //   $lookup: {
    //     from: WebCategories.collection.collectionName,
    //     localField: 'category_id',
    //     foreignField: '_id',
    //     as: 'category',
    //   },
    // });

    pipelines.push(matchPipeline);

    return await ParentsSettingModel.aggregate(pipelines).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = ParentsSettingAction.buildFilterQuery(filter);
    const countPipeline: PipelineStage = {
      $match: conditions,
    };
    const pipelines = [];


    // pipelines.push({
    //   $lookup: {
    //     from: WebCategories.collection.collectionName,
    //     localField: 'category_id',
    //     foreignField: '_id',
    //     as: 'category',
    //   },
    // });

    pipelines.push(countPipeline);
    return ParentsSettingModel.aggregate(pipelines)
    .then((result) => result.length);
  }
}




