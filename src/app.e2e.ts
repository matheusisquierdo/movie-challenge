import { test } from "tap";
import { buildServer } from "./app";




test("Movies count", async (t) => {

    const fastify = await buildServer();

    if(!fastify) {
        return fastify;
    }

    t.teardown(() => fastify.close())

    const response = await fastify.inject({
        method: "GET",
        url: "/movies",
    });
    
    t.equal(response.statusCode, 200);


    const objResponse = JSON.parse(response.payload);

  
    t.equal(objResponse.length == 206, true);

});

test("Winners count", async (t) => {
   
    const fastify = await buildServer();

    if(!fastify) {
        return fastify;
    }

    t.teardown(() => fastify.close())

    const response = await fastify.inject({
        method: "GET",
        url: "/winners",
    });
    
    t.equal(response.statusCode, 200);


    const objResponse = JSON.parse(response.payload);

    
    t.equal(objResponse.length == 94, true);


});


test("Max 'Matthew Vaughn, interval: 22", async (t) => {
   
    const fastify = await buildServer();

    if(!fastify) {
        return fastify;
    }

    t.teardown(() => fastify.close())

    const response = await fastify.inject({
        method: "GET",
        url: "/winners/summaries",
    });
    
    t.equal(response.statusCode, 200);


    const objResponse = JSON.parse(response.payload);

    t.equal(!!objResponse.max, true);
    t.equal(objResponse.max.length == 1, true);


    const { producer, interval, previousWin, followingWin} = objResponse.max[0];
    t.equal(producer == 'Matthew Vaughn' && interval == 13 && previousWin== 2002 && followingWin== 2015, true);


});


test("Min 'Matthew Vaughn, interval: 22", async (t) => {
   
    const fastify = await buildServer();

    if(!fastify) {
        return fastify;
    }

    t.teardown(() => fastify.close())

    const response = await fastify.inject({
        method: "GET",
        url: "/winners/summaries",
    });
    
    t.equal(response.statusCode, 200);


    const objResponse = JSON.parse(response.payload);

    t.equal(!!objResponse.max, true);
    t.equal(objResponse.max.length == 1, true);


    const { producer, interval, previousWin, followingWin} = objResponse.min[0];
    t.equal(producer == 'Joel Silver' && interval == 1 && previousWin== 1990 && followingWin== 1991, true);


});

