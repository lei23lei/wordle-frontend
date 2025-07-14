import { api } from "./api";

export const itemsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<ItemsResponse[], void>({
      query: () => "/items",
      providesTags: ["Items"],
    }),
    createItem: builder.mutation<ItemsResponse, CreateItemBody>({
      query: (body) => ({
        url: "/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Items"],
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = itemsEndpoints;
