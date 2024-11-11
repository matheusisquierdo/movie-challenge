import { test } from "tap";
import { buildServer } from "./app";

test("GET /", async (t) => {
   
    const fastify = await buildServer();

    if(!fastify) {
        return fastify;
    }

    t.teardown(() => fastify.close())

    const response = await fastify.inject({
        method: "GET",
        url: "/",
    });
    
    t.equal(response.statusCode, 200);


    const objResponse = JSON.parse(response.payload);

    t.equal(!!objResponse.max && !!objResponse.min, true);

    t.equal(objResponse.min && Array.isArray(objResponse.min),  true);

    t.equal(objResponse.max && Array.isArray(objResponse.max),  true);

});
