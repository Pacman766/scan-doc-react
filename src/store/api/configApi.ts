import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Config} from "../../types/config";

export const configApi = createApi({
    reducerPath: 'configApi',
    baseQuery: fetchBaseQuery({baseUrl: '/portal/rs/scan'}),
    tagTypes: ['Config'],

    endpoints: (builder) => ({
        getConfig: builder.query<Config, void>({
            query: () => '/config',
            providesTags: ['Config'],
        }),

        saveConfig: builder.mutation<Config, Partial<Config>>({
            query: (newConfig) => ({
                url: 'config/save',
                method: 'PUT',
                body: newConfig
            }),
            invalidatesTags: ['Config']
        }),
    }),
});

export const { useGetConfigQuery, useSaveConfigMutation } = configApi;