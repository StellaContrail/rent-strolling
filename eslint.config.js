import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // GSI実データ等、テンプレートリテラル内の全角スペースを扱うため許容する
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
    },
  },
);
