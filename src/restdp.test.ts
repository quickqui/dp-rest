import request from "supertest";
import { useRest } from "./express";
import { dp } from "./mockdp";
import express from "express";
const app = express();
app.use(express.json());

useRest(app, dp);

test("root 404", () => {
  return request(app)
    .get("/")
    .then((response) => {
      expect(response.statusCode).toBe(404);
    });
});
test("get one", () => {
  return request(app)
    .get("/posts/2")
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ id: 2, name: "second" })
      );
    });
});
test("get one, more than need", () => {
  return request(app)
    .get('/posts/2?filter={"author_id":12}')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ id: 2, name: "second" })
      );
    });
});
test("list filter", () => {
  return request(app)
    .get('/posts?filter={"name":"second"}')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.headers["content-range"]).toEqual(
        expect.stringContaining("0-0/1")
      );
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 2, name: "second" }),
        ])
      );
    });
});
test("list sort", () => {
  return request(app)
    .get('/posts?sort=["name","DESC"]')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.headers["content-range"]).toEqual(
        expect.stringContaining("0-1/2")
      );
      expect(response.body).toEqual([
        expect.objectContaining({ id: 2, name: "second" }),
        expect.objectContaining({ id: 1, name: "first" }),
      ]);
    });
});
test("list range", () => {
  return request(app)
    .get("/posts?range=[0,1]")
    .then((response) => {
      expect(response.statusCode).toBe(206);
      expect(response.body.length).toBe(1);
      expect(response.headers["content-range"]).toEqual(
        expect.stringContaining("0-0/2")
      );
      expect(response.body).toEqual([
        expect.objectContaining({ id: 1, name: "first" }),
      ]);
    });
});
test("list range, and filter", () => {
  return request(app)
    .get('/posts?range=[0,1]&filter={"name":"second"}')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.headers["content-range"]).toEqual(
        expect.stringContaining("0-0/1")
      );
      expect(response.body).toEqual([
        expect.objectContaining({ id: 2, name: "second" }),
      ]);
    });
});
test("post", () => {
  return request(app)
    .post("/posts")
    .send({ name: "third" })
    .then((r) => {
      expect(r.statusCode).toBe(201);
      expect(r.body).toEqual(expect.objectContaining({ name: "third" }));
      expect(r.body.id).toBeDefined();
    });
});
test("update", () => {
  return request(app)
    .put("/posts/2")
    .send({ name: "second2", id: 2 })
    .then((r) => {
      expect(r.statusCode).toBe(200);
      expect(r.body).toEqual(expect.objectContaining({ name: "second2" }));
      expect(r.body.id).toBe(2);
    });
});
test("delete", () => {
  return request(app)
    .delete("/posts/2")
    .then((r) => {
      expect(r.statusCode).toBe(200);
      expect(r.body).toEqual(expect.objectContaining({ id: 2 }));
    });
});
