import { Configs } from "../../configurations";
import mongoose from "mongoose";
import User, { IUser } from "../../api/users/user.model";
import expect from "expect";
import httpMocks from "node-mocks-http";
import UserController from "../../../src/api/users/user.controller";
import { Request } from "express";
import JWTPayload from "../../../src/api/interfaces/jwt-payload.interface";
import { encrypt } from "../../../src/api/utils/password-utils";
import RESPONSE_CODES from "../../../src/api/utils/response-codes";

const API_ROUTE = "/api/users";
const EMAIL = "tony.tang@test.com";

describe("User controller", () => {

    const userController = new UserController();

    // Connect to MongoDB before each tests.
    beforeEach(async () => {
        await mongoose.connect(Configs.getDatabaseConfig().connectionString, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    });

    // Close connection to MongoDB after each tests.
    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it("Should get all users", async () => {
        for (let i = 0; i < 3; i++) {
            const user = new User({
                email: EMAIL,
                hash: "dwight6wd54rfg8961ws6dg6quem465d1rg"
            });

            await user.save();
        }

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "GET",
            url: API_ROUTE
        });

        const response = httpMocks.createResponse();

        await userController.getAll(request, response);

        expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
        const data: IUser[] = JSON.parse(response._getData());

        data.forEach(user => {
            expect(user).toMatchObject(
                {
                    email: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );

            expect(user.email).toBe(EMAIL);
        });
    });

    it("Should get one user", async () => {
        const user = new User({
            email: EMAIL,
            hash: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await user.save();

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "GET",
            url: API_ROUTE,
            params: {
                id: user._id
            }
        });

        const response = httpMocks.createResponse();

        await userController.getOneById(request, response);

        expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
        const data: IUser = JSON.parse(response._getData());

        expect(data).toMatchObject(
            {
                email: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        );

        expect(user.email).toBe(EMAIL);
    });

    it("Should create a user", async () => {
        const user = {
            email: EMAIL,
            password: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        };

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "POST",
            url: API_ROUTE,
            body: user
        });

        const response = httpMocks.createResponse();

        await userController.create(request, response);

        expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
        const data: IUser = JSON.parse(response._getData());

        expect(data).toEqual({ status: "ok" });
    });

    it("Should delete a user", async () => {
        const user = new User({
            email: EMAIL,
            hash: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await user.save();

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "DELETE",
            url: API_ROUTE,
            params: {
                id: user._id
            }
        });
        const response = httpMocks.createResponse();

        await userController.delete(request, response);

        expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
        const data = JSON.parse(response._getData());

        expect(data).toEqual({ status: "ok" });
    });

    it("Should update a user", async () => {
        const user = new User({
            email: EMAIL,
            hash: "dwight6wd54rfg8961ws6dg6quem465d1rg"
        });

        await user.save();

        const updatedUser = {
            email: "not.tony@test.com",
            password: "xwcgr96465.xwc5EX"
        };

        const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
            method: "PUT",
            url: API_ROUTE,
            body: updatedUser
        });

        const response = httpMocks.createResponse();

        await userController.update(request, response);

        expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
        const data: IUser = JSON.parse(response._getData());

        expect(data).toEqual({ status: "ok" });
    });

    describe("#signUp", () => {

        it("Should sign user up", async () => {
            const user = {
                email: EMAIL,
                password: "dwight6wd54rfg8961ws6dg6quem465d1rg"
            };

            const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
                method: "POST",
                url: "/api/signUp",
                body: user
            });

            const response = httpMocks.createResponse();

            await userController.singUp(request, response);

            expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
            const data: IUser = JSON.parse(response._getData());

            expect(data).toMatchObject(
                {
                    token: expect.any(String)
                }
            );
        });

        it("Should not sign user up", async () => {
            const password = "password46463E.GT";
            const hash = await encrypt(password);
            const user = new User({
                email: EMAIL,
                hash: hash
            });
            await user.save();

            const testUser = {
                email: EMAIL,
                password: password
            };

            const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
                method: "POST",
                url: "/api/signUp",
                body: testUser
            });

            const response = httpMocks.createResponse();

            await userController.singUp(request, response);

            expect(response._getStatusCode()).toBe(RESPONSE_CODES.INTERNAL_ERROR.code);
            const data = JSON.parse(response._getData());

            expect(data).toMatchObject(
                {
                    error: expect.any(String)
                }
            );
        });
    });

    describe("#logIn", () => {
        it("Should log user in", async () => {
            const password = "password46463E.GT";
            const hash = await encrypt(password);
            const user = new User({
                email: EMAIL,
                hash: hash
            });
            await user.save();

            const testUser = {
                email: EMAIL,
                password: password
            };


            const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
                method: "POST",
                url: "/api/logIn",
                body: testUser
            });

            const response = httpMocks.createResponse();

            await userController.logIn(request, response);

            expect(response._getStatusCode()).toBe(RESPONSE_CODES.VALID.code);
            const data: IUser = JSON.parse(response._getData());

            expect(data).toMatchObject(
                {
                    token: expect.any(String)
                }
            );
        });

        it("Should not log user in", async () => {
            const password = "password46463E.GT";
            const hash = await encrypt(password);
            const user = new User({
                email: EMAIL,
                hash: hash
            });
            await user.save();

            const testUser = {
                email: EMAIL,
                password: password + "wrong"
            };


            const request: httpMocks.MockRequest<Request> & JWTPayload = httpMocks.createRequest({
                method: "POST",
                url: "/api/logIn",
                body: testUser
            });

            const response = httpMocks.createResponse();

            await userController.logIn(request, response);

            expect(response._getStatusCode()).toBe(RESPONSE_CODES.INTERNAL_ERROR.code);
            const data = JSON.parse(response._getData());

            expect(data).toMatchObject(
                {
                    error: expect.any(String)
                }
            );
        });
    });
});