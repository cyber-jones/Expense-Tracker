import Transaction from "../models/transactionSchema.js";

const transactionResolver = {
    Query: {
        transactions: async (_, inputs, context) => {
            try {
                if (!context.getUser()) throw new Error("Unauthorize");
                const userId = context.getUser()._id;

                const transactions = await Transaction.find({ userId });
                return transactions;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        },

        transaction: async (_, { transactionId }) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        }
    },

    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({...input, userId: context.getUser()._id});
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            } 
        },

        updateTransaction: async (_, { input }, context) => {
            try {
                const upadatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, { new: true });
                await upadatedTransaction.save();
                return upadatedTransaction;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            } 
        },

        deleteTransaction: async (_, { transactionId }, context) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            } 
        }
    }
}


export default transactionResolver;