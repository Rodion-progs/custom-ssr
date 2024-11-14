import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import {ViteDevServer} from "vite";
import { Render } from "../../server.tsx";
interface GetTemplateProps {
    url: string;
    next: NextFunction;
    vite: ViteDevServer;
}

export const getTemplate = async ({ url, next, vite }: GetTemplateProps): Promise<string> => {
    let template;

    try {
        if (process.env.NODE_ENV === "development") {
            template = fs.readFileSync(path.resolve("./index.html"), "utf-8")

            template = await vite.transformIndexHtml(url, template)
        } else {
            template = fs.readFileSync(
                path.resolve("dist/client/index.html"),
                "utf-8"
            )
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            vite.ssrFixStacktrace(error)
        }
        next(error)
    }

    return template
}

export const renderToString = async ({ next, vite }: { next: NextFunction; vite: ViteDevServer }): Promise<Render> => {
    let render: Render;

    console.log(process.env.NODE_ENV)

    try {
        if (process.env.NODE_ENV === "development") {
            render = (await vite.ssrLoadModule("/src/server.tsx")).render
        } else {
            render = (await import(path.resolve('dist/server/server.js') as { render: Render })).render;
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            vite.ssrFixStacktrace(error)
        }
        next(error)
    }

    return render;
}

interface InsertDataProps<Result> {
    render: Render;
    template: string;
    url: string;
    field: string;
    res: Response;
    result: Result;
    meta: {
        title: string;
        description: string
    }
}
export function insertData<Result>({ render, template, res, result, url, field, meta }: InsertDataProps<Result>): string {

    const appHtml = render({ path: url, [field]: result });
    const data = `<script>window.__SSR_DATA__=${JSON.stringify(
        {[field]: result}
    )}</script>`;

    const metaTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
`

    const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(`<!--ssr-data-->`, data)
        .replace(`<!--ssr-metatags-->`, metaTags)

    res.status(200).set({"Content-Type": "text/html"}).end(html);

    return html;
}
