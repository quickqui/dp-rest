import dote from "dotenv";
dote.config();
import _ from "lodash";
import { log } from "./Util";

// const port = 3000;

import {
  GET_ONE,
  GetOneResult,
  GET_LIST,
  GetListResult,
  GetListParams,
  CREATE,
  CreateResult,
  UPDATE,
  UpdateResult,
  DeleteResult,
  DELETE,
  DataProvider,
} from "@quick-qui/data-provider";
export function useRest(app, dp:DataProvider) {
  app.all("/:resource/:id?", async (req, res) => {
    const method = req.method;
    const { resource, id } = req.params;
    log.debug("method - ", method);
    log.debug("resource - ", resource);
    log.debug("id - ", id);
    const { sort, range, filter } = _(req.query)
      .mapValues((v) => JSON.parse(v))
      .value();
    log.debug("sort - ", sort);
    log.debug("range - ", range);
    log.debug("filter - ", filter);
    if (method === "GET") {
      if (id !== undefined) {
        //getOne
        res.json(
          ((await dp(GET_ONE, resource, { id })) as GetOneResult<unknown>)?.data
        );
      } else {
        //getList
        const re = (await dp(GET_LIST, resource, {
          sort: sort ? { field: sort[0], order: sort[1] } : undefined,
          pagination: range ? { page: 1, perPage: range[1] } : undefined,
          filter,
        } as GetListParams)) as GetListResult<unknown>;
        const total = re.total;
        const items = re.data;
        if (total > 0) {
          let first = range ? range[0] : 0;
          let last = range
            ? Math.min(items.length - 1 + first, range[1])
            : items.length - 1;
          res.set("Content-Range", `items ${first}-${last}/${total}`);
          res.status(items.length === total ? 200 : 206);
          res.json(items);
        }
      }
    } else if (method === "POST") {
      const body = req.body;
      log.info(resource)
      const re = (await dp(CREATE, resource, {
        data: body,
      })) as CreateResult<unknown>;
      res.status(201).json(re.data);
    } else if (method === "PUT") {
      const body = req.body;
      const re = (await dp(UPDATE, resource, {
        id,
        data: body,
      })) as UpdateResult<unknown>;
      res.json(re.data);
    } else if (method === "DELETE") {
      const re = (await dp(DELETE, resource, {
        id,
      })) as DeleteResult<unknown>;
      res.json(re.data);
    } else {
      res.status(400);
      res.send("method not supported");
    }
  });
}
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
