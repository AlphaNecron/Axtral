import {Button, Group, Stack, Title} from '@mantine/core';
import Container from 'components/Container';
import UserAvatar from 'components/UserAvatar';
import useSession from 'lib/hooks/useSession';
import router from 'next/router';
import {FiChevronLeft, FiLogOut} from 'react-icons/fi';

export default function LogoutPage() {
  const session = useSession(true, () => router.push('/auth/login'));
  const logOut = () => fetch('/api/auth/logout').finally(() => router.push('/auth/login'));
  return session.isLogged && (
    <Container style={{ padding: 64 }}>
      <Stack align='center'>
        <UserAvatar size={180} user={session.user}/>
        <Title order={4}>Signed in as {session.user.name || session.user.username || session.user.id}</Title>
        <Group spacing={4}>
          <Button color='green' onClick={() => router.back()} leftIcon={<FiChevronLeft/>}>Go back</Button>
          <Button color='red'
            onClick={() => logOut()}
            leftIcon={<FiLogOut/>}>Logout</Button>
        </Group>
      </Stack>
    </Container>
  );
}

LogoutPage.title = 'Logout';
