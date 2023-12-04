import dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "@jest/globals";
import mongoose from "mongoose";
import { register } from "../../src/services/auth.service";
import { deleteUser } from "../../src/services/user.service";
import * as geolocService from "../../src/services/geoloc.service";

describe("Test geoloc service", () => {
  beforeAll(async () => {
    dotenv.config();
    if (process.env.DB_STRING_CON) {
      await mongoose.connect(process.env.DB_STRING_CON, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    } else {
      console.error("DB_CONN_STRING is not defined");
    }
  });

  it("should be able to get address", async () => {
    const address = await geolocService.getAddress("A", "A", 72000, 65);

    expect(address.length).toBe(1);
    expect(address[0]).toBe("4 Rue des Cygnes 72000 Le Mans");
  });

  it("should be able to get geoloc", async () => {
    const user = await register(
      "testUnit3",
      "testUnit3@unit.testUnit",
      "testUnit3"
    );

    const geoloc = await geolocService.getGeoloc(
      "A",
      "A",
      72000,
      65,
    );

    expect(geoloc.length).toBe(1);
    expect(geoloc[0]["address"]).toBe("4 Rue des Cygnes 72000 Le Mans");
    expect(geoloc[0]["latitude"]).toBe("48.0090975");
    expect(geoloc[0]["longitude"]).toBe("0.2228414");

    await deleteUser(user.userProfile.id);
  });
});
