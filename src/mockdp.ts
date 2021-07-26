import { withStaticData } from "@quick-qui/data-provider"

export const dp = withStaticData({
  posts: [
    {
      id: 1,
      name: "first",
    },
    {
      id: 2,
      name: "second",
    },
  ],
}).value();