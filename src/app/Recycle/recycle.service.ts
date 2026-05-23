// src/app/modules/recycle/recycle.service.ts
import { Transaction } from "../Transaction/transaction.model";
import { buildRecyclePipeline } from "./recycle.pipeline";

type RecycleQuery = {
  page?: string;
  limit?: string;
  days?: string;
  search?: string;
};

type RecycleAggResult = {
  total: number;
  cutoff: Date;
  data: any[];
};

export const RecycleService = {
  getRecycleList: async (query: RecycleQuery) => {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 100)));
    const days = Math.max(1, Number(query.days || 3));
    const search = query.search ? String(query.search) : undefined;

    const pipeline = buildRecyclePipeline({ page, limit, days, search });

    const agg = await Transaction.aggregate<RecycleAggResult>(pipeline);
    const result = agg?.[0];

    return {
      total: result?.total || 0,
      page,
      limit,
      days,
      cutoff: result?.cutoff,
      data: result?.data || [],
    };
  },
};
