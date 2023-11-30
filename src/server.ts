import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoose from "mongoose";
import * as authRoute from "./routes/auth.route";
import * as geolocRoute from "./routes/geoloc.route";
import * as savedSearchRoute from "./routes/savedSearch.route";
import * as userRoute from "./routes/user.route";

dotenv.config();

mongoose
  .connect(process.env.DB_STRING_CON, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

const app: express.Application = express();

const port = process.env.PORT || 3030;

app.use(helmet());
app.use(express.json());
app.use(authRoute.getRouter());
app.use(geolocRoute.getRouter());
app.use(savedSearchRoute.getRouter());
app.use(userRoute.getRouter());

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
