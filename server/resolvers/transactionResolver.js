import Transaction from "../models/transactionSchema.js";
import User from "../models/userSchema.js";

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
        },

        categoryStatistics: async (_, inputs, context) => {
            try {
                if (!context.getUser()) new Error("Unauthorized!");
                const userId = context.getUser()._id;
                const transaction = await Transaction.find({ userId });

                let categoryMap = {}; // { expense: 120, savings: 50, investment: 130 }
                transaction.forEach(transaction => {
                    if (!categoryMap[transaction.category])
                        categoryMap[transaction.category] = 0;
                    categoryMap[transaction.category] += transaction.amount
                });

                // [{ category: expense, totalAmount: 120 }, { category: savings, totalAmount: 50 }, { category: investment, totalAmount: 130 }]
                return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
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
    },

    Transaction: {
        user: async (parent) => {
            try {
                const userId = parent.userId
                const user = await User.findById(userId);
                return user;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            } 
        }
    }
}


export default transactionResolver;