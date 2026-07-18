import { Prisma } from '@prisma/client';

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  // 1. Convert hard deletes to soft deletes
  if (params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  } else if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    params.args['data'] = { ...params.args['data'], deletedAt: new Date() };
  }

  // 2. Filter out deleted records on find / count queries
  // (We rewrite findUnique to findFirst to bypass the Prisma unique criteria constraint)
  if (
    ['findUnique', 'findFirst', 'findMany', 'count'].includes(params.action)
  ) {
    if (params.action === 'findUnique') {
      params.action = 'findFirst';
    }
    params.args = params.args || {};
    params.args.where = params.args.where || {};
    if (params.args.where.deletedAt === undefined) {
      params.args.where.deletedAt = null;
    }
  }

  return next(params);
};
