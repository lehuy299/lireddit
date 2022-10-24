import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {

    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const [pause, setPause] = useState(true);

    useEffect(() => {
        setPause(false);
    });

    const [{ data, fetching }] = useMeQuery({ pause });
    let body;

    if (!!fetching) {
        body = null;
    } else if (!data?.me) {
        body = <>
            <NextLink href="/login">
                <Link mr={2}>login</Link>
            </NextLink>
            <NextLink href="/register">
                <Link>register</Link>
            </NextLink>
        </>
    } else {
        body = <Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button isLoading={logoutFetching} onClick={() => { logout({}); }} variant="link">logout</Button>
        </Flex>
    }

    return (
        <Flex bg='tan' p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );
}

export default NavBar;