import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import Layout from "../components/Layout";
import { Wrapper } from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = () => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();

    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    createPost({ input: values });
                    router.push('/');
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="text..."
                                label="Body"
                            />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);