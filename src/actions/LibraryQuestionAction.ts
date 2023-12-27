import { FilterQuery as FilterQueryMG, PipelineStage } from 'mongoose';
import { LibraryQuestion, LibraryQuestionModel } from '@/models/LibraryQuestion';
import _ from 'lodash';
import { SubjectModel } from '@/models/Subject';

export default class LibraryQuestionAction {
  public static buildFilterQuery(filter: any): FilterQueryMG<LibraryQuestion> {
    const conditions: any = {};

    if (filter.question_type) {
      conditions.category = {
          $regex: _.escapeRegExp(filter.question_type),
          $options: 'i',
        };
  }

    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = LibraryQuestionAction.buildFilterQuery(filter);
    const pageSize = filter.page_size || 20;
    const pageNumber = filter.page_number || 1;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const matchPipeline: PipelineStage = {
      $match: conditions,
    };

    const pipelines = [];

    pipelines.push(matchPipeline);

    pipelines.push({
      $lookup: {
        from: SubjectModel.collection.collectionName,
        localField: 'subject_id',
        foreignField: '_id',
        as: 'subject',
      },
    });

    return await LibraryQuestionModel.aggregate(pipelines).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = LibraryQuestionAction.buildFilterQuery(filter);
    const countPipeline: PipelineStage = {
      $match: conditions,
    };
    const pipelines = [];

    pipelines.push(countPipeline);
    return LibraryQuestionModel.aggregate(pipelines)
    .then((result) => result.length);
  }
}




