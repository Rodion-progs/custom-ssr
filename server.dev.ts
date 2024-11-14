import express, { Express } from "express"
import { createServer } from "vite"
import {createRouter} from "./src/server/routes";
import path from "path";

const port = 5174

const createDevServer = async (): Promise<void> => {
    const app: Express = express()

    const viteServer = await createServer({
        server: { middlewareMode: true },
        appType: "custom",
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.use(viteServer.middlewares);
    app.use(express.static(path.resolve("dist/client"), { index: '/' }))

    app.use(createRouter(viteServer))

    app.listen(port)
    console.log(`http://localhost:${port}`)
}

createDevServer().then(() => {
    console.log(`Dev server running at  http://localhost:${port}`)
})
