import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

const userResolver = {
    Query: {
        authUser: async (_, inputs, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        },
        
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        }
    },

    Mutation : {
        signUp: async (_, { input }, context) => {
            try {
                const { username, password, gender, name } = input;

                if (!username || !name || !password || !gender)
                    throw new Error("All fields are required!");

                const existingUser = await User.findOne({ username });
                if (existingUser) throw new Error("User already exist");

                const salt = await bcrypt.genSaltSync(10);
                const hashedPassword = await bcrypt.hashSync(password, salt);

                //https://avatar-placeholder.iran.liara.run/
                let profilePicture = ''; 
                if (gender.toLowerCase() == "male")
                    profilePicture = `https://avatar-placeholder.iran.liara.run/boy?username=${username}` 

                if (gender.toLowerCase() == "female")
                    profilePicture = `https://avatar-placeholder.iran.liara.run/girl?username=${username}` 
               
                const newUser = new User({ username, name, password: hashedPassword, profilePicture, gender});
                await newUser.save(); 
                console.log(newUser);
                return newUser;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        },

        logIn: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                const { user } = await context.authenticate("graphql-local", {username, password});

                await context.login(user);
                return user;
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        },

        logOut: async (_, inputs, context) => {
            try {
                await context.logout()
                context.req.session.destroy((err) => {
                    if (err) throw err
                });
                context.res.clearCookie("connect.sid");
                return { message: "Logout Successful" };
            } catch (err) {
                throw new Error(err.message  || "Internal Server Error");
            }
        }
    }
} 


export default userResolver;