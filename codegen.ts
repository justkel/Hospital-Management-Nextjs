import 'dotenv/config'; // this loads .env automatically
import type { CodegenConfig } from '@graphql-codegen/cli';

const { NEXT_PUBLIC_GATEWAY_URL = 'http://localhost:8000/graphql' } = process.env;

const config: CodegenConfig = {
  schema: [
    {
      [NEXT_PUBLIC_GATEWAY_URL]: {
        headers: {},
      },
    },
  ],
  documents: ['src/shared/graphql/documents/**/*.graphql'],
  generates: {
    'src/shared/graphql/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
  overwrite: true,
};

export default config;
