import request from 'supertest'
import {app} from './express'
test('simple',()=>{
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
})
