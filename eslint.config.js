// eslint.config.js
export default [
  {
    ignores: [
      'node_modules',
      'public/', // Ignore public assets like JS/CSS
      'scripts/seed.js' // Optional: ignore one-time scripts
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        $: 'readonly' // for jQuery in public/main.js
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off'
    }
  }
];
