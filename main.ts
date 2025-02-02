import { Hono } from "hono";
import page from "./index.tsx";

const PREFIX = "short";
const DNS = "http://localhost:8000";

const app = new Hono();
const kv = await Deno.openKv();

app.route("/", page)
    .post("/", async (c) => {
        const { url } = await c.req.json();
        const key = (() => Math.random().toString(36).substring(5))();
        await kv.set([PREFIX, key], url);
        return c.json({ shortenedPath: `${DNS}/${key}` });
    })
    .get("/:key", async (c) => {
        const { key } = c.req.param();
        const redirectUrl = (await kv.get([key])).value as string;
        if (!redirectUrl) {
            return c.json({ error: "URL not found" }, 404);
        }
        return c.redirect(redirectUrl);
    });

Deno.serve(app.fetch);

// curl http://localhost:8000
