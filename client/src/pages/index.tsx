import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {

  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 5
    }
  });
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      {
        fetching 
          ? <div>loading...</div>
          : data?.posts.map((post) => <div>
              <div>{post.title}</div>
              <pre>{post.text}</pre>
            </div>)
      }
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
