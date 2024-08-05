import lume from "lume/mod.ts";
import lumocs from "./lumocs/mod.ts";

const site = lume();

site.use(lumocs());


export default site;
