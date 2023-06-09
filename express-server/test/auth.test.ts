const app = require("../src/express/app").app;
const request = require("supertest");
const agent = request.agent(app);
const authHeader = require("basic-auth-header");

const dotenv = require("dotenv");
dotenv.config();

const { pool } = require("../src/helpers").pool;

const createAuthHeader = (username, password) => {
    return {
        Authorization: authHeader(username, password),
    };
};

const reCaptchaQueryParam = {
    "g-recaptcha-response": process.env.RECAPTCHA_TEST_TOKEN,
};

const adminPassword = "password123";
const adminUsername = "johndoe@email.com";

let server;

beforeEach(() => {
    const testPort = 3002;

    server = app.listen(testPort, () => {
        console.log(`Server running on port ${testPort}`);
    });
});

afterEach(async () => {
    await server.close();
});

afterAll(() => {
    pool.end();
});

describe("Testing login route", () => {
    test("Test with admin user", async () => {
        expect.assertions(3);

        /*
        TODO:

        2. Login with the admin user
        3. Check if the response is 200
        4. Check if the request role is correct
         */

        const response = await agent
            .get("/login")
            .query(reCaptchaQueryParam)
            .set(createAuthHeader(adminUsername, adminPassword))
            .send();

        expect(response.status).toBe(200);
        expect(response.body.isAdmin).toBe(true);
        expect(response.body.userId).toBe(1);
    });

    test("Test with a regular user", async () => {
        expect.assertions(5);

        /*
        Steps:
        
        Create a new user
        Login with the new user
        Check if the response is 200
        Check if the request role is correct
        
        Delete user
         */

        const newUser = {
            email: "test@example.com",
            password: "password123",
            isAdmin: false,
            firstName: "test",
            lastName: "user",
        };

        let userId = null;
        let createResponse = null;

        try {
            createResponse = await agent
                .post("/user")
                .set(createAuthHeader(adminUsername, adminPassword))
                .send(newUser);

            expect(createResponse.status).toBe(200);

            userId = createResponse.body.userId;

            const loginResponse = await agent
                .get("/login")
                .query(reCaptchaQueryParam)
                .set(createAuthHeader(newUser.email, newUser.password))
                .send();

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body.isAdmin).toBe(false);
            expect(loginResponse.body.userId).toBe(userId);
        } finally {
            const deleteResponse = await agent
                .delete(`/user/${userId}`)
                .set(createAuthHeader(adminUsername, adminPassword))
                .send();

            expect(deleteResponse.status).toBe(204);
        }
    });
});
