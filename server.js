const fs = require("fs");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const postgres = knex({
	client: "pg", // our database client
	connection: {
		host: process.env.DATABASE_URL, // this = local host (then changed to heroku's address)
		ssl: true,
	},
});

postgres
	.select("*")
	.from("users")
	.then((data) => {
		// console.log(data);
	});

const app = express();

app.use(express.urlencoded({ extended: false })); // call to pars json body
app.use(express.json()); // must be before the requests!
app.use(cors());

app.get("/", (req, res) => {
	res.send("it is working!");
});

app.post("/signin", (req, res) => {
	signin.handleSignin(req, res, postgres, bcrypt);
});

app.post("/register", (req, res) => {
	register.handleRegister(req, res, postgres, bcrypt);
});

app.get("/profile/:id", (req, res) => {
	profile.handleProfileGet(req, res, postgres);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, postgres);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

const PORT = process.env.PORT;
app.listen(PORT || 3001, () => {
	console.log(`app is running on port ${PORT}`); // bash command -> "PORT=3001 node server.js"
});
console.log(PORT);
