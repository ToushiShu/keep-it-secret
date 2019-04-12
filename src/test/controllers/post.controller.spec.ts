import { Configs } from "../../configurations";
import mongoose from "mongoose";
import Post, { IPost } from "../../api/posts/post.model";
import expect from "expect";
import httpMocks from "node-mocks-http";
import PostController from "../../../src/api/posts/post.controller";
import { Request } from "express";
import JWTPayload from "../../../src/api/interfaces/jwt-payload.interface";
import { describe } from "mocha";

const API_ROUTE = "/api/posts";
const AUTHOR = "tony.tang@test.com";

describe("Post controller", () => {

    const postController = new PostController();

    // Connect to MongoDB before each tests.
    beforeEach(async () => {
        await mongoose.connect(Configs.getDatabaseConfig().connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    });

    // Close connection to MongoDB after each tests.
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should get all posts", async () => {
        for (let i = 0; i < 3; i++) {
            const post = new Post({
                author: AUTHOR,
                message: "my secret message",
                encryptedMessage: "dwight6wd54rfg8961ws6dg6quem465d1rg"
            });

            await post.save();
        }

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "GET",
            url: API_ROUTE
        });

        const response = httpMocks.createResponse();

        await postController.getAll(request, response);
        const data: IPost[] = JSON.parse(response._getData());

        data.forEach(post => {
            expect(post).toMatchObject(
                {
                    author: expect.any(String),
                    message: expect.any(String),
                    encryptedMessage: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );

            expect(post.author).toBe(AUTHOR);
        });
    });

    it("Should get one post", async () => {
        const post = new Post({
            author: AUTHOR,
            message: "my secret message",
            encryptedMessage: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await post.save();

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "GET",
            url: API_ROUTE,
            params: {
                id: post._id
            }
        });

        const response = httpMocks.createResponse();

        await postController.getOneById(request, response);
        const data: IPost = JSON.parse(response._getData());

        expect(post).toMatchObject(
            {
                author: expect.any(String),
                message: expect.any(String),
                encryptedMessage: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }
        );

        expect(post.author).toBe(AUTHOR);
    });

    it("Should create a post", async () => {
        const post = {
            author: AUTHOR,
            message: "my secret message"
        };

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "POST",
            url: API_ROUTE,
            body: post
        });
        request.user = { email: AUTHOR };

        const response = httpMocks.createResponse();

        await postController.create(request, response);
        const data: IPost = JSON.parse(response._getData());

        expect(data).toMatchObject(
            {
                author: expect.any(String),
                message: expect.any(String),
                encryptedMessage: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        );

        expect(data.author).toBe(AUTHOR);
    });

    it("Should delete a post", async () => {
        const post = new Post({
            author: AUTHOR,
            message: "my secret message",
            encryptedMessage: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await post.save();

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "DELETE",
            url: API_ROUTE,
            params: {
                id: post._id
            }
        });
        const response = httpMocks.createResponse();

        await postController.delete(request, response);

        const data = JSON.parse(response._getData());

        expect(data).toEqual({ status: "ok" });
    });

    it("Should update a post", async () => {
        const post = new Post({
            author: AUTHOR,
            message: "my secret message",
            encryptedMessage: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await post.save();

        const updatedPost = {
            author: "not.tony@test.com",
            message: "my secret message"
        };

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "PUT",
            url: API_ROUTE,
            body: updatedPost
        });
        request.user = { email: updatedPost.author };

        const response = httpMocks.createResponse();

        await postController.update(request, response);

        const data: IPost = JSON.parse(response._getData());

        expect(data).toMatchObject(
            {
                author: expect.any(String),
                message: expect.any(String),
                encryptedMessage: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        );

        expect(data.author).toEqual(updatedPost.author);
    });
});