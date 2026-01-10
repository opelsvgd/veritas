import { z } from 'zod';
import { 
  insertUserSchema, 
  insertWalletSchema,
  insertInvestmentSchema,
  insertWithdrawalRequestSchema,
  users,
  wallets,
  balances,
  investmentPlans,
  investments,
  transactions,
  withdrawalRequests
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === USER & AUTH ===
  me: {
    method: 'GET' as const,
    path: '/api/me',
    responses: {
      200: z.custom<typeof users.$inferSelect>(),
      401: errorSchemas.unauthorized,
    },
  },

  // === DASHBOARD DATA ===
  dashboard: {
    method: 'GET' as const,
    path: '/api/dashboard',
    responses: {
      200: z.object({
        balance: z.custom<typeof balances.$inferSelect>(),
        activeInvestments: z.array(z.custom<typeof investments.$inferSelect & { planName: string }>()),
        recentTransactions: z.array(z.custom<typeof transactions.$inferSelect>()),
      }),
      401: errorSchemas.unauthorized,
    },
  },

  // === INVESTMENT PLANS ===
  plans: {
    list: {
      method: 'GET' as const,
      path: '/api/plans',
      responses: {
        200: z.array(z.custom<typeof investmentPlans.$inferSelect>()),
      },
    },
  },

  // === INVESTMENTS ===
  investments: {
    create: {
      method: 'POST' as const,
      path: '/api/investments',
      input: insertInvestmentSchema,
      responses: {
        201: z.custom<typeof investments.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },

  // === WITHDRAWALS ===
  withdrawals: {
    create: {
      method: 'POST' as const,
      path: '/api/withdrawals',
      input: insertWithdrawalRequestSchema,
      responses: {
        201: z.custom<typeof withdrawalRequests.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/withdrawals',
      responses: {
        200: z.array(z.custom<typeof withdrawalRequests.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // === ADMIN ===
  admin: {
    deposits: {
      method: 'GET' as const,
      path: '/api/admin/deposits',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
        403: errorSchemas.unauthorized,
      },
    },
    withdrawals: {
      pending: {
        method: 'GET' as const,
        path: '/api/admin/withdrawals/pending',
        responses: {
          200: z.array(z.custom<typeof withdrawalRequests.$inferSelect>()),
          403: errorSchemas.unauthorized,
        },
      },
      approve: {
        method: 'POST' as const,
        path: '/api/admin/withdrawals/:id/approve',
        input: z.object({ txHash: z.string() }),
        responses: {
          200: z.custom<typeof withdrawalRequests.$inferSelect>(),
          404: errorSchemas.notFound,
          403: errorSchemas.unauthorized,
        },
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
