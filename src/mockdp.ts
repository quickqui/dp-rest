import { withStaticData } from "@quick-qui/data-provider/dist/dataProvider/DataProviders"

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
});