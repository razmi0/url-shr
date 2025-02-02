import { Hono } from "hono";
import HomePage from "./src/homepage.tsx";
import renderer from "./src/renderer.tsx";

export default new Hono().use(renderer).get("/", (c) => c.render(<HomePage />));
