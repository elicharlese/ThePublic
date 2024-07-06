import purchasesResolver from './purchasesResolver';
import exampleResolver from './exampleResolver'; // Add more resolvers as needed

export default {
  Query: {
    ...purchasesResolver.Query,
    ...exampleResolver.Query,
  },
  Mutation: {
    ...exampleResolver.Mutation,
  },
};