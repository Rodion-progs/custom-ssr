# Custom ssr project using react, vite, express

## for start project
install dependencies
```
yarn install
```

build project

```
yarn build
```


start server for production
```
yarn prod
```

start server for dev
```
yarn dev
```

## structure project

The project has two page

### Home page
Home page show list of characters with ssr render

### Character page
Character page describe selected character

## Cache rendered pages
Project can cache pages by regular expression
You can change regular in server.js file const regexForCache;
