import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <Layout>
    <NextLink href="/create-post">
      <Link>create post</Link>
    </NextLink>
    <div>Hello world</div>
  </Layout>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
