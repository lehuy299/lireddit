import { Box, Button, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from 'react';
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });
  console.log('variables',variables);
  
  if (!data && !fetching) {
    return <div>query failed</div>
  }

  return (
    <Layout>
      <Flex align='center'>
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml='auto'>create post</Link>
        </NextLink>
      </Flex>
      {
        fetching && !data
          ? <div>loading...</div>
          : <Stack mt={8} spacing={8}>
              {data!.posts.map((post) => <Box key={post._id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>)}
          </Stack>
      }
      {data ? <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: 10,
                cursor: data.posts[data.posts.length - 1].createdAt
              })
            }} 
            my={8} 
            mx='auto'
          >
            Load more
          </Button>
        </Flex> : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
