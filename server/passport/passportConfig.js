import passport from "passport";
import bcrypt from "bcryptjs"
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../models/userSchema.js";




export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });



    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch(err) {
            done(err);
        }
    });


    passport.use(
        new GraphQLLocalStrategy( async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) throw new Error("Invalid username");

                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) throw new Error("Invalid password");

                return done(null, user);
            } catch(err) {
                return done(err);
            }
        })
    )
}

