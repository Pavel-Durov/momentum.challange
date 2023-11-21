# TypeScript Template

## Getting started

```shell
$ yarn
```

## Run
```shell
$yarn start
```

## Test
```shell
$ npm run test
```

## Lint

```shell
$ yarn lint # lint check
$ yarn lint:fix # lint write
```

## Git hooks

### Tests

```shell
npx husky add .husky/pre-commit "npm test" 
npx husky add .husky/pre-commit "npm run lint" 
git add .husky/pre-commit
```

### Commit message

```shell
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
npm pkg set scripts.commitlint="commitlint --edit"
npx husky add .husky/commit-msg 'npm run commitlint ${1}'
```
