# TypeScript Template

## Overview

In this solution, we have multiple components - `Server`, `UpdateJob`, `Store`, `Scraper` and the `Classifier`.

`Store` - simple in-memory store. Stores scraped company information.

`Server` - serves incoming HTTP traffic and returns classified/scraped company data from the Store.

`UpdateJob` - updates and schedules future cronjob to update company information in the `Store`.


`Scraper` - scrapes website information and classifies each company site with its findings. Each site might have multiple classifications. 

`Classifier` - the decision-making component based on the scraped company information. Currently, it's a dump component, it just uses the first scraped information it gets but it can be extended.

## Known issues

- This design was intended to be included in a single process, for simplicity reasons and time constraints. An actual implementation would probably include multiple distributed components. For example, if we want to scale `Server` horizontally we will need to distribute `Server`, `UpdateJob` and `Store`.

- Some HTML pages fail to load, others are empty files.

- In terms of scraping classification, the only thing I could think about in the given timeframe was to check included scripts and global variables. I am sure there's more that can be done to improve chat technology identification.

- Scraping classification has low accuracy - it can only identify a few Drift and a few Salesforce chats.

- I am not sure what kind of tooling was used for snapshotting HTML files but I think it can be definitely improved.
  
- It takes time to scrape all the HTML files. The server endpoint `GET /chat/find` will return the data it has, but the list might be incomplete if the processing of HTML files is not completed.

## Install dependencies

```shell
$ yarn
```

## Run
```shell
$ yarn start
```
### Try it
```shell
$ curl -i -XGET  localhost:8000/chat/find  
HTTP/1.1 200 OK
...

[..., {"companyName":"bittitan.html","chatType":"Drift"}, ...{"companyName":"exabeam.html","chatType":"None"}, ..., {"companyName":"konfio.mx.html","chatType":"Salesforce"}, ...]
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
