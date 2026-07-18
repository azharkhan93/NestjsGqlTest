import { Prisma, PrismaClient } from '@prisma/client';

const SOFT_DELETE_MODELS = [
  'Role',
  'User',
  'VendorProfile',
  'VendorBankDetails',
  'Service',
  'Booking',
  'Review',
  'Dispute',
  'Verification',
  'ServiceCategory',
  'CustomerProfile',
  'CustomerAddress',
  'Payment',
];

interface SoftDeleteDelegate {
  update(args: { where: unknown; data: { deletedAt: Date } }): Promise<unknown>;
  updateMany(args: {
    where: unknown;
    data: { deletedAt: Date };
  }): Promise<unknown>;
  findFirst(args: unknown): Promise<unknown>;
}

export const softDeleteExtension = (client: PrismaClient) => {
  return Prisma.defineExtension({
    name: 'softDeleteExtension',
    query: {
      $allModels: {
        async delete({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
            const delegate = Reflect.get(client, modelKey) as
              | SoftDeleteDelegate
              | undefined;
            if (delegate) {
              return delegate.update({
                where: args.where,
                data: { deletedAt: new Date() },
              });
            }
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
            const delegate = Reflect.get(client, modelKey) as
              | SoftDeleteDelegate
              | undefined;
            if (delegate) {
              return delegate.updateMany({
                where: args.where,
                data: { deletedAt: new Date() },
              });
            }
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
            const delegate = Reflect.get(client, modelKey) as
              | SoftDeleteDelegate
              | undefined;
            if (delegate) {
              const where = { ...(args.where || {}), deletedAt: null };
              return delegate.findFirst({ ...args, where });
            }
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const tempArgs = args as Record<string, unknown>;
            const where = (tempArgs.where || {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              where.deletedAt = null;
            }
            tempArgs.where = where;
          }
          return query(args);
        },
        async findMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const tempArgs = args as Record<string, unknown>;
            const where = (tempArgs.where || {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              where.deletedAt = null;
            }
            tempArgs.where = where;
          }
          return query(args);
        },
        async count({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model)) {
            const tempArgs = args as Record<string, unknown>;
            const where = (tempArgs.where || {}) as Record<string, unknown>;
            if (where.deletedAt === undefined) {
              where.deletedAt = null;
            }
            tempArgs.where = where;
          }
          return query(args);
        },
      },
    },
  });
};
