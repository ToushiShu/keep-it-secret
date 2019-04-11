import { Configs } from "../../configurations";
import mongoose from "mongoose";
import Post from "../../api/posts/post.model";
import expect from "expect";

describe("Post model", () => {

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
        const post = new Post();

        expect(post.validate).toThrow();
    });

    it("Should save a post", async () => {
        expect.assertions(2);

        const author = "Tony";

        const post = new Post({
            author: author,
            message: "my secret message",
            encryptedMessage: "qshdgmwdfngmqmrgh"
        });

        await post.save();

        expect(post).toMatchObject({
            author: expect.any(String),
            message: expect.any(String),
            encryptedMessage: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          });

          expect(post.author).toBe(author);
    });
});