import { Configs } from "../../configurations";
import mongoose from "mongoose";
import User from "../../api/users/user.model";
import expect from "expect";

describe("User model", () => {

    // Connect to MongoDB before each tests.
    beforeEach(async () => {
        await mongoose.connect(Configs.getDatabaseConfig().connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    });

    // Close connection to MongoDB after each tests.
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should throw validation errors", () => {
        const user = new User();

        expect(user.validate).toThrow();
    });

    it("Should save a user", async () => {
        expect.assertions(2);

        const email = "tony_tang@test.com";

        const user = new User({
            email: email,
            hash: "496w65sdgr89wd465fg48w9s"
        });

        await user.save();

        expect(user).toMatchObject({
            email: expect.any(String),
            hash: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });

        expect(user.email).toBe(email);
    });
});