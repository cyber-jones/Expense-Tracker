import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./userResolver.js";
import transactionResolver from "./transactionResolver.js";

const mergeCustomResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergeCustomResolvers;