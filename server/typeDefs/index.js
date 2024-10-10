import { mergeTypeDefs } from "@graphql-tools/merge";
import userTyeDef from "./userTypeDef.js";
import transactionTypeDef from "./transactionTypeDef.js";

const mergeCustomTypeDefs = mergeTypeDefs([userTyeDef, transactionTypeDef]);

export default mergeCustomTypeDefs;