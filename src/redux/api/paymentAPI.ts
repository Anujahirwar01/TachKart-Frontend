import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MessageResponse } from "../../types/api-types";

export const paymentAPI = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
    }),
    tagTypes: ["coupon"],
    endpoints: (builder) => ({
        newCoupon: builder.mutation<MessageResponse, { code: string, amount: number, userId: string }>({
            query: ({ code, amount, userId }) => ({
                url: `coupon/new?id=${userId}`,
                method: "POST",
                body: { code, amount },
            }),
            invalidatesTags: ["coupon"]
        }),
    }),
});

export const { useNewCouponMutation } = paymentAPI;
