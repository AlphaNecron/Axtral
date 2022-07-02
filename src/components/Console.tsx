import {ScrollArea, ScrollAreaProps, Stack, useMantineTheme} from '@mantine/core';
import {DateTime} from 'luxon';
import React from 'react';

export default function Console({ lines, ...props }: { lines: { timestamp: string, level: 'info' | 'warn' | 'error' | 'debug', message: string }[] } & ScrollAreaProps) {
  const { colors } = useMantineTheme();
  const levelColors = {
    info: 'green',
    debug: 'blue',
    warn: 'yellow',
    error: 'red'
  };
  const colorize = (level: string) => colors[levelColors[level]][6] ?? 'gray';
  return (
    <ScrollArea scrollbarSize={4} offsetScrollbars {...props}>
      <Stack spacing={0}>
        {lines.map((line, i) => (
          <code style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }} key={i}>
            <span>
            [
              <span style={{ color: colors.blue[6] }}>
                {DateTime.fromISO(line.timestamp).toFormat('D - TT')}
              </span>
            ]
            </span>
            <span style={{ color: colorize(line.level) }}> {line.level}: </span>
            <span>{line.message}</span>
          </code>
        ))}
      </Stack>
    </ScrollArea>
  );
}