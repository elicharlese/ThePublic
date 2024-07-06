import { getPurchasesByAccount } from '../services/purchasesService';

const purchasesResolver = {
  Query: {
    purchases: async (_, { account }) => {
      return await getPurchasesByAccount(account);
    },
  },
};

export default purchasesResolver;