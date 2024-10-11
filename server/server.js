import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import mergeCustomResolvers from "./resolvers/index.js";
import mergeCustomTypeDefs from "./typeDefs/index.js";
import express  from "express";
import http from "http";
import cors from "cors";
import "dotenv/config"
import { connectDb } from "./config/connectDb.js";
import connectMongo from "connect-mongodb-session";
import session from "express-session";
import passport from "passport";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passportConfig.js";
// import path from "path";



connectDb();
const app = express();
// const __dirname = path.resolve();
const httpServer = http.createServer(app);
const mongoDbStore = connectMongo(session);

const store = new mongoDbStore({
    uri: process.env.MONGO_URI_PRODUCTION,
    collection: "sessions"
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, //Save session for every request
        saveUninitialized: false, //Save unitialized session
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "None",
            secure: true
        },
        store,
    })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

const server = new ApolloServer({
    typeDefs: mergeCustomTypeDefs,
    resolvers: mergeCustomResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use("/graphql", 
    cors({
        origin: ["http://localhost:3000", "https://expense-tracker-gamma-rose.vercel.app"],
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
    }),
);

// app.use(express.static(path.join(__dirname, "client/dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// })

await new Promise( resolve  => httpServer.listen(4000, resolve));

console.log(`Server`);