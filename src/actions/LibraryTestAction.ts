import { FilterQuery as FilterQueryMG, PipelineStage } from 'mongoose';
import { LibraryTest, LibraryTestModel } from '@/models/LibraryTestModel';
import { FolderModel } from '@/models/LibraryTestModel';
import { LevelModel } from '@/models/LibraryTestModel';
import { TypeModel } from '@/models/LibraryTestModel';
import { StatusModel } from '@/models/LibraryTestModel';
import { UserModel } from '@/models/User';
import { TagModel } from '@/models/LibraryTestModel/Tag';
import _ from 'lodash';

export default class LibraryTestAction {
  public static buildFilterQuery(filter: any): FilterQueryMG<LibraryTest> {
    const conditions: any = {};

    if (filter.folder_id) {
        conditions.folder = {
            $regex: _.escapeRegExp(filter.folder_id),
            $options: 'i',
          };
    }

    if (filter.type_id) {
        conditions.type = {
            $regex: _.escapeRegExp(filter.type_id),
            $options: 'i',
          };
    }

    if (filter.level_id) {
        conditions.level = {
            $regex: _.escapeRegExp(filter.level_id),
            $options: 'i',
          };
    }

    if (filter.creator_id) {
        conditions.user = {
            $regex: _.escapeRegExp(filter.creator_id),
            $options: 'i',
          };
    }

    return conditions;
  }

  public static async findAllAndPaginated(filter) {
    const conditions = LibraryTestAction.buildFilterQuery(filter);
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
        from: FolderModel.collection.collectionName,
        localField: 'folder',
        foreignField: '_id',
        as: 'folder',
      },
    });

    pipelines.push({
        $lookup: {
          from: TypeModel.collection.collectionName,
          localField: 'type',
          foreignField: '_id',
          as: 'type',
        },
      });

      pipelines.push({
        $lookup: {
          from: LevelModel.collection.collectionName,
          localField: 'level',
          foreignField: '_id',
          as: 'level',
        },
      });

      pipelines.push({
        $lookup: {
          from: StatusModel.collection.collectionName,
          localField: 'status',
          foreignField: '_id',
          as: 'status',
        },
      });

      pipelines.push({
        $lookup: {
          from: UserModel.collection.collectionName,
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      });

      pipelines.push({
        $lookup: {
          from: TagModel.collection.collectionName,
          localField: 'tag',
          foreignField: '_id',
          as: 'tags', 
        },
      });


      // pipelines.push({
      //   $addFields: {
      //     tag: {
      //       $map: {
      //         input: '$tags',
      //         as: 'tagItem',
      //         in: {
      //           id: '$$tagItem._id',
      //           name: '$$tagItem.name',
      //         },
      //       },
      //     },
      //   },
      // });
      
      // pipelines.push({
      //   $project: {
      //     tags: 0, 
      //   },
      // });

      pipelines.push({
        $sort: {
          ['topic']: 1,
        },
      });
      

    return await LibraryTestModel.aggregate(pipelines).skip(skip).limit(limit).exec();
  }

  public static count(filter): Promise<number> {
    const conditions = LibraryTestAction.buildFilterQuery(filter);
    const countPipeline: PipelineStage = {
      $match: conditions,
    };
    const pipelines = [];


    pipelines.push(countPipeline);

    return LibraryTestModel.aggregate(pipelines)
    .then((result) => result.length);
  }
}




