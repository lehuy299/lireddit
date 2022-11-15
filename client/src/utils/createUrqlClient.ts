import { cacheExchange, Entity, Resolver } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { filter, pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from "next/router";

export const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes('not authenticated')) {
                Router.push('/login');
            }
        })
    );
};

export const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isInCache = cache.resolve(cache.resolve(entityKey, fieldKey) as Entity, 'posts');
        console.log('isInCache',isInCache);
        
        info.partial = !isInCache;

        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        let hasMore = true;
        const results: string[] = [];
        fieldInfos.forEach((fi) => {
            const key = cache.resolve(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, 'posts') as string[];
            const _hasMore = cache.resolve(key, 'hasMore');
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });
        console.log('results',results);
        console.log('hasMore',hasMore);
        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results
        };
    };
};

export const createUrqlClient = ((ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: "include" as const
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            keys: {
                PaginatedPosts: () => null,
            },
            resolvers: {
                Query: {
                    posts: cursorPagination()
                }
            },
            updates: {
                Mutation: {
                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        )
                    },
                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return { me: result.login.user }
                                }
                            }
                        )
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return { me: result.register.user }
                                }
                            }
                        )
                    },
                }
            }
        }),
        errorExchange,
        ssrExchange,
        fetchExchange
    ]
}))