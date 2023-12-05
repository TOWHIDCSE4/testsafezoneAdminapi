import { FilterQuery as FilterQueryMG } from 'mongoose';
import { PromptAI, PromptAIModel  } from '@/models/AI';
import _ from 'lodash';

export default class PromptAIActions {
  public static buildFilterQuery(filter: any): FilterQueryMG<PromptAI> {
    const conditions: any = {};
    if (filter._id) {
      conditions._id = filter._id;
    }
    if (filter.search) {
      conditions.title = {
        $regex: _.escapeRegExp(filter.search),
        $options: 'i',
      };
    }
    if (filter.category_obj_id) {
      conditions.category_obj_id = filter.category_obj_id;
    }
    if (filter.prompt) {
      conditions.prompt = filter.prompt;
    }
    if (filter.is_active || filter.is_active === false) {
      conditions.is_active = filter.is_active;
    }
    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = PromptAIActions.buildFilterQuery(filter);
    const pageSize = filter.page_size || 20;
    const pageNumber = filter.page_number || 1;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;
    return PromptAIModel.find(conditions, {}).populate('category').skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = PromptAIActions.buildFilterQuery(filter);
    return PromptAIModel.countDocuments(conditions).exec();
  }
}
