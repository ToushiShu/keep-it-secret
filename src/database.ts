import mongoose from "mongoose";

export default class Database {
    private connectionString: string;

    /**
     * constructor.
     * @param connectionString connectionString for mongoose.
     */
    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    /**
     * Connect to MongoDB.
     */
    public connectToDb() {
        (<any>mongoose).Promise = Promise;

        mongoose.connect(this.connectionString, { useNewUrlParser: true })
            .then(() => {
                console.log("Connected to MongoDB : " + this.connectionString);
            }).catch(err => {
                console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
                process.exit();
            });
    }

}