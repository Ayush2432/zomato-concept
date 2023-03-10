// In NODE we have to set up some configurations to set up babel to convert high level
// ES6 to low level for some of the browser in react it comes prebuilt
// now after configuring babel we can use import

// env variable
require("dotenv").config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import googleAuthConfig from "./config/google.config";
import routeConfig from "./config/route.config";
import session from "express-session";

// Microservices routes
import Auth from "./API/Auth";
import Restaurant from "./API/Restaurant";
import Food from "./API/Food";
import Menu from "./API/Menu";
import Image from "./API/Image";
import Order from "./API/Order";
import Review from "./API/Reviews";
import User from "./API/Order";

// Database Connection
import ConnectDB from "./database/connection";


const zomato = express(); //initializing it with express

// setting up express
zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false }));
zomato.use(helmet());
zomato.use(cors());

var sess = {
  secret: "sessionSecret",
  resave:true,
  cookie: {},
  saveUninitialized: true
};
if (zomato.get("env") === "production") {
  zomato.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

zomato.use(session(sess));
zomato.use(passport.initialize());
zomato.use(passport.session());

// passport configuration
googleAuthConfig(passport);
routeConfig(passport);

// For application routes  this is done so that the whole application uses this API for auth\
zomato.use("/auth", Auth); //we r telling zomato to use auth and inside auth we have /signup so the whole route would be localhost:4000/auth/signup
zomato.use("/restaurant", Restaurant);
zomato.use("/food", Food);
zomato.use("/menu", Menu);
zomato.use("/image", Image);
zomato.use("/order", Order);
zomato.use("/reviews", Review);
zomato.use("/user", User);

// setting the route
zomato.get("/", (req, res) => res.json({ message: "Setup success" }));

// setting the port
zomato.listen(4000, () =>
  ConnectDB()
    .then(() => console.log("Server is up and running"))
    .catch(() => console.log("DB Connection Failed"))
);

// firstly the when the port was running then it was showing server is up and running
// now when the database is connection then it will be showing whenever we are connected to the database and if some error occurs then it throws the catch statement .
