import dote from "dotenv";
dote.config();
import express from "express";
import _ from "lodash";
import { log } from "./Util";
export const app = express();
// const port = 3000;

import { dp } from "./mockdp";
import { GET_ONE, GetOneResult } from "@quick-qui/data-provider";
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
  if (method === "GET" && id !== undefined) {
    //getOne
    res.json(
      ((await dp(GET_ONE, resource, { id })) as GetOneResult<unknown>)?.data
    );
  }
});

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
