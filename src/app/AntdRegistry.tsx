'use client';

import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { App, ConfigProvider } from 'antd';
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
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
          },
          components: {
            Button: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Input: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Form: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Typography: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Modal: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Select: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
            Table: {
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
}
