import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import __dirname from "./utils.js";
import viewRouter from "./Dao/routes/views.routes.js";
import { readJSON } from "./utils.js";
import productRouter from "./Dao/routes/products.router.js";
import cartRouter from "./Dao/routes/cart.router.js";
import realTimeProducts from "./Dao/routes/realTimeProducts.js";
import productsDb from "./Dao/routes/productsDb.routes.js";
import cartRouterDb from "./Dao/routes/cartsDb.routes.js";
import configureServerSocket from "./Dao/socketConfig/socketConfig.js";
import "./database.js";
const app = express();
const hbs = handlebars.create({
  partialsDir: path.join(app.get("views"), "partials"),
  helpers: {
    readJSON: readJSON,
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", hbs.engine);

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const PORT = process.env.PORT || 8080;

//Socket
/* const socket = configureServerSocket(server); */
const { server } = configureServerSocket(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} http://localhost:${PORT}`);
});

app.use("/realTimeProducts", realTimeProducts);
app.use("/api/productsDatabase", productsDb);
app.use("/api/cartsDb", cartRouterDb);
app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);