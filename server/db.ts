import { connect } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();


const getMongoUri = () => {
    if (process.env.MONGO_URI) {
        return process.env.MONGO_URI;
    }
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
        return `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@confereusauth.7ihufgu.mongodb.net/confereus?retryWrites=true&w=majority`;
    }
    const host = process.env.MONGO_HOST || 'mongodb';
    const port = process.env.MONGO_PORT || 27017;
    const db = process.env.MONGO_DB || 'confereus';
    return `mongodb://${host}:${port}/${db}?replicaSet=rs0`;
};

const mongoUri = getMongoUri();
const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
console.log(`Connecting to MongoDB at: ${maskedUri}`);

connect(mongoUri)
    .then((_) => console.log("Connected to database."))
    .catch((e) => console.error("Database connection error:", e));