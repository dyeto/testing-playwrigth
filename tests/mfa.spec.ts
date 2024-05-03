import { test, expect, Page } from '@playwright/test';
import { config as dotenv } from 'dotenv';
import { fakerFR as faker } from '@faker-js/faker';
import config from "../config/default.json"
test.beforeAll(async ({ request }) => {
    dotenv()
    //get token
    const res = await request.post(`${process.env.HOST}/oauth/token`, {
        data: {
            grant_type: "client_credentials",
            client_id: process.env.MANAGEMENT_CLIENT_ID,
            client_secret: process.env.MANAGEMENT_CLIENT_SECRET,
            scope: "webuser:manage manage:users read:users read:user-events mfa:manage"
        }
    })
    const data = await res.json()
    process.env.managementAccessToken = data.access_token
});



test("MFA", async ({ request }) => {

    await test.step("Token should be set successfully", () => {
        expect(process.env.managementAccessToken).toBeDefined();
    });

    await test.step("Signup should pass", async () => {

        const email = faker.internet.email()
        const customerNumber = faker.number.int({ min: 1e9, max: 1e10 - 1 })
        const password = faker.internet.password({ memorable: true, length: 4, prefix: 'Test@2024' })

        const res = await request.post(`${process.env.API_HOST}/webusers`, {
            data: {
                "identity": {
                    "firstName": faker.person.firstName(),
                    "lastName": faker.person.lastName(),
                    "gender": faker.helpers.arrayElement(["male", 'female']),
                    "store": faker.number.int({ max: 100 }),
                    "customerNumber": customerNumber
                },
                "account": {
                    "logins": {
                        "password": password,
                        "emailAddress": {
                            "value": email
                        }
                    }
                }
            },
            headers: {
                Scope: "profile full_write phone",
                Authorization: `Bearer ${process.env.managementAccessToken}`,
                'X-Business-Unit': config.bu
            }
        })

        const data = await res.json()
        //console.log(data)
        expect(res.status()).toBe(201)


        expect(data.webUserId).toBeDefined()
        process.env.webUserId = data.webUserId
        process.env.email = email
        process.env.customerNumber = customerNumber.toString()
        process.env.password = password

    });

    await test.step("MFA Registration start", async () => {
        const res = await request.post(`${process.env.API_HOST}/webusers/mfa/register/${process.env.webUserId}/start`, {
            data: {
                "phoneNumber": "+33610241133"
            },
            headers: {
                Authorization: `Bearer ${process.env.managementAccessToken}`,
                'X-Business-Unit': config.bu
            }
        })

        console.log(process.env)
        expect(res.status()).toBe(204)

    })
});


