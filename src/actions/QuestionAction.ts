import { FilterQuery as FilterQueryMG, PipelineStage } from 'mongoose';
import { Question, QuestionModel } from '@/models/Question';
import _ from 'lodash';

export default class QuestionAction {
  public static buildFilterQuery(filter: any): FilterQueryMG<Question> {
    const conditions: any = {};

    if (filter.name) {
      conditions.name = {
          $regex: _.escapeRegExp(filter.name),
          $options: 'i',
        };
  }

  if (filter.question_type) {
    if (typeof filter.question_type === 'string') {
      conditions.question_type = {
        $regex: _.escapeRegExp(filter.question_type),
        $options: 'i',
      };
    } else if (typeof filter.question_type === 'number') {
      conditions.question_type = filter.question_type;
    }
  }

  if (filter.question_level) {
    if (typeof filter.question_level === 'string') {
      conditions.question_level = {
        $regex: _.escapeRegExp(filter.question_level),
        $options: 'i',
      };
    } else if (typeof filter.question_level === 'number') {
      conditions.question_level = filter.question_level;
    }
  }

    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = QuestionAction.buildFilterQuery(filter);
    const pageSize = filter.page_size || 20;
    const pageNumber = filter.page_number || 1;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const matchPipeline: PipelineStage = {
      $match: conditions,
    };

    const pipelines = [];

    pipelines.push(matchPipeline);

    return await QuestionModel.aggregate(pipelines).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = QuestionAction.buildFilterQuery(filter);
    const countPipeline: PipelineStage = {
      $match: conditions,
    };
    const pipelines = [];

    pipelines.push(countPipeline);
    return QuestionModel.aggregate(pipelines)
    .then((result) => result.length);
  }
}




