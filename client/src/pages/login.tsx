import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
  } from "@chakra-ui/react";
  import { useMutation } from "urql";
  import { Formik, Form } from "formik";
  import React from "react";
  import { InputField } from "../components/InputField";
  import { Wrapper } from "../components/Wrapper";
  import { useLoginMutation } from "../generated/graphql";
  import { toErrorMap } from "../utils/toErrorMap";
  import { useRouter } from "next/router";
  
  interface loginProps {}
  
  const Login: React.FC<loginProps> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, {setErrors}) => {
            const response = await login({ options: values});
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField 
                name="username"
                placeholder="Username"
                label="Username"
              />
              <Box mt={4}>
                <InputField 
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  };
  
  export default Login;
  