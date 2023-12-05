import { FilterQuery as FilterQueryMG } from 'mongoose';
import { Template, TemplateModel } from '@/models/Template';

export default class TemplateActions {
  public static buildFilterQuery(filter: any): FilterQueryMG<Template> {
    const conditions: any = {};
    if (filter._id) conditions._id = filter._id;
    if (filter.type) conditions.type = filter.type;
    if (filter.code) conditions.code = filter.code;
    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = TemplateActions.buildFilterQuery(filter);
    const pageSize = filter.page_size || 20;
    const pageNumber = filter.page_number || 1;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    return TemplateModel.find(conditions, {}).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = TemplateActions.buildFilterQuery(filter);
    return TemplateModel.countDocuments(conditions).exec();
  }
}
