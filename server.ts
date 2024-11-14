import path from "path"
import express, { Express } from "express"
import { createServer as createViteServer } from "vite";
import compression from "compression";
import { createRouter } from './src/server/routes';
const port = 5174;

const createServer = async (): Promise<void> => {
    const app: Express = express();

    const vite = await createViteServer();

    app.use(compression())
    app.use(express.static(path.resolve("dist/client"), { index: '/' }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // app.use(vite.middlewares);

    app.use(createRouter(vite))

    app.listen(port)
}

createServer().then(() => {
    console.log(`http://localhost:${port}`)
})
