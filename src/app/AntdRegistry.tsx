'use client';

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { useServerInsertedHTML } from 'next/navigation';
import { useMemo } from 'react';

export default function AntdRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = useMemo(() => createCache(), []);

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{
        __html: extractStyle(cache, true),
      }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Montserrat, sans-serif',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
