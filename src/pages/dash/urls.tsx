import {Anchor, Autocomplete, Button, Stack, Text} from '@mantine/core';
import {useClipboard, useDisclosure} from '@mantine/hooks';
import CardGrid from 'components/CardGrid';
import HiddenQR from 'components/HiddenQR';
import ItemCard from 'components/ItemCard';
import ShortenDialog from 'dialogs/Shorten';
import useQuery from 'lib/hooks/useQuery';
import {Permission} from 'lib/permission';
import React from 'react';
import {FiClipboard, FiExternalLink, FiScissors, FiSearch, FiTrash} from 'react-icons/fi';
import useSWR from 'swr';

export default function Page_URLs() {
  const {data, mutate} = useSWR('/api/user/urls', (url: string) => fetch(url).then(r => r.json()));
  const {query, handler} = useQuery();
  const [opened, dHandler] = useDisclosure(false);
  const clipboard = useClipboard();
  return (
    <>
      <ShortenDialog opened={opened} onClose={dHandler.close} onShorten={() => mutate()}/>
      <Stack>
        <div style={{display: 'flex'}}>
          <Button leftIcon={<FiScissors/>} onClick={dHandler.open}>
            Shorten
          </Button>
          <Autocomplete ml='xs' style={{flex: 1}} icon={<FiSearch/>} placeholder='Search something' value={query}
            onChange={handler.set}
            data={(data && data.files) ? Array.from(new Set([...data.map(url => url.destination), ...data.map(url => url.short)])) : []}/>
        </div>
        <CardGrid itemSize={375}>
          {data && handler.filterList(data, ['short', 'destination']).map((url, i) =>
            <ItemCard key={i} actions={[
              {
                label: 'Copy to clipboard',
                color: 'green',
                icon: <FiClipboard/>,
                action: () => clipboard.copy(`${window.location.origin}/${url.short}`)
              }, {
                label: 'Open in new tab',
                color: 'blue',
                icon: <FiExternalLink/>,
                action: () => window?.open(`/${url.short}`, '_blank')
              }, {
                label: 'Delete',
                color: 'red',
                icon: <FiTrash/>,
                action: () => console.log('del')
              }
            ]}>
              <div style={{display: 'flex', margin: 16}}>
                <HiddenQR value={`${window.location.origin}/${url.short}`}/>
                <div style={{flex: 1, marginLeft: 16}}>
                  <Text size='sm' weight={700}>
                    ID: {url.id}
                    <br/>
                    Created at: {new Date(url.createdAt).toLocaleString()}
                    <br/>
                    Destination: <Anchor size='sm' href={url.destination}>
                      {url.destination}
                    </Anchor>
                    <br/>
                    Views: {url.views}
                    <br/>
                    Has password: {url.password ? 'Yes' : 'No'}
                  </Text>
                </div>
              </div>
            </ItemCard>
          )}
        </CardGrid>
      </Stack>
    </>
  );
}

Page_URLs.title = 'URLs';
Page_URLs.authRequired = true;
Page_URLs.permission = Permission.SHORTEN;
