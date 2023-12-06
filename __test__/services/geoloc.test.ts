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

  it("should not find any dep", async () => {
    try {
      const address = await geolocService.getAddress("B", "B", 72000, 32);
    } catch (error) {
      expect(error.message).toBe("No dep found");
    }
  });

  it("should be able to get geoloc", async () => {
    const user = await register(
      "testUnit3",
      "testUnit3@unit.testUnit",
      "testUnit3"
    );

    const geoloc = await geolocService.getGeoloc("A", "A", 72000, 65);

    expect(geoloc.length).toBe(1);
    expect(geoloc[0]["address"]).toBe("4 Rue des Cygnes 72000 Le Mans");
    expect(geoloc[0]["latitude"]).toBe("48.0090975");
    expect(geoloc[0]["longitude"]).toBe("0.2228414");

    await deleteUser(user.userProfile.id);
  });

  it("should be able to get geoloc link", async () => {
    const user = await register(
      "testUnit3",
      "testUnit3@unit.testUnit",
      "testUnit3"
    );

    const geolocData = await geolocService.getGeolocLink(
      "https://www.immonot.com/annonce-immobiliere/0000017194__w16989191111863374/achat-maison-a-vendre-vaas-sarthe.html"
    );

    expect(geolocData.dpe).toBe("E");
    expect(geolocData.ges).toBe("B");
    expect(geolocData.zipcode).toBe("72500");
    expect(geolocData.surface).toBe("144,08");
    expect(geolocData.geoloc[0]["address"]).toBe(
      "51 Route de la Vigne Rouge 72500 Montval-sur-Loir"
    );
    expect(geolocData.geoloc[0]["latitude"]).toBe("47.6835304");
    expect(geolocData.geoloc[0]["longitude"]).toBe("0.3847336");

    await deleteUser(user.userProfile.id);
  }, 10000);
});
