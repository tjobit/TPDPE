import dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "@jest/globals";
import mongoose from "mongoose";
import { register } from "../../src/services/auth.service";
import { deleteUser } from "../../src/services/user.service";
import * as savedSearchService from "../../src/services/savedSearch.service";

import SavedSearches from "../../src/models/savedSearches";

describe("Test savedSearch service", () => {
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

  it("should be able to save a search", async () => {
    const user = await register(
      "testUnit2",
      "testUnit2@unit.testUnit",
      "testUnit2"
    );

    const saveSearch = await savedSearchService.saveSearch(
      "A",
      "B",
      75001,
      50,
      [],
      user.userProfile
    );

    const search = await SavedSearches.findById(saveSearch.id);

    expect(search.parameters.Etiquette_DPE).toBe("A");
    expect(search.parameters.Etiquette_GES).toBe("B");
    expect(search.parameters["Code_postal_(BAN)"]).toBe(75001);
    expect(search.parameters.Surface_habitable_logement).toBe(50);

    await deleteUser(user.userProfile.id);
  });

  it("should be able to relaunch a search", async () => {
    const user = await register(
      "testUnit2",
      "testUnit2@unit.testUnit",
      "testUnit2"
    );

    const saveSearch = await savedSearchService.saveSearch(
      "A",
      "A",
      72000,
      65,
      [
        {
          address: "4 Rue des Cygnes 72000 Le Mans",
          latitude: "48.0090975",
          longitude: "0.2228414",
        },
      ],
      user.userProfile
    );

    const search = await savedSearchService.reLaunchSavedSearch(
      saveSearch.id,
      user.userProfile
    );

    expect(search["results"][0]["address"]).toBe(
      "4 Rue des Cygnes 72000 Le Mans"
    );
    expect(search["results"][0]["latitude"]).toBe("48.0090975");
    expect(search["results"][0]["longitude"]).toBe("0.2228414");

    await deleteUser(user.userProfile.id);
  });

  it("should not find search for this user", async () => {
    let user;
    try {
      user = await register(
        "testUnit2",
        "testUnit2@unit.testUnit",
        "testUnit2"
      );

      const search = await savedSearchService.reLaunchSavedSearch(
        "1testunit",
        user.userProfile
      );
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("Saved search not found for this user");
    }
  });

  it("should be able to get saved searches", async () => {
    const user = await register(
      "testUnit2",
      "testUnit2@unit.testUnit",
      "testUnit2"
    );

    await savedSearchService.saveSearch(
      "A",
      "A",
      72000,
      65,
      [
        {
          address: "4 Rue des Cygnes 72000 Le Mans",
          latitude: "48.0090975",
          longitude: "0.2228414",
        },
      ],
      user.userProfile
    );

    const searches = await savedSearchService.getSavedSearches(
      1,
      user.userProfile
    );

    expect(searches[0]["parameters"]["Etiquette_DPE"]).toBe("A");
    expect(searches[0]["parameters"]["Etiquette_GES"]).toBe("A");
    expect(searches[0]["parameters"]["Code_postal_(BAN)"]).toBe(72000);
    expect(searches[0]["parameters"]["Surface_habitable_logement"]).toBe(65);

    expect(searches[0]["results"][0]["address"]).toBe(
      "4 Rue des Cygnes 72000 Le Mans"
    );
    expect(searches[0]["results"][0]["latitude"]).toBe("48.0090975");
    expect(searches[0]["results"][0]["longitude"]).toBe("0.2228414");

    await deleteUser(user.userProfile.id);
  });

  it("should be able to delete a saved search", async () => {
    const user = await register(
      "testUnit2",
      "testUnit2@unit.testUnit",
      "testUnit2"
    );

    const saveSearch = await savedSearchService.saveSearch(
      "A",
      "A",
      72000,
      65,
      [
        {
          address: "4 Rue des Cygnes 72000 Le Mans",
          latitude: "48.0090975",
          longitude: "0.2228414",
        },
      ],
      user.userProfile
    );

    const searches = await savedSearchService.getSavedSearches(
      1,
      user.userProfile
    );

    expect(searches.length).toBe(1);

    await savedSearchService.deleteSavedSearch(saveSearch.id, user.userProfile);

    const searches2 = await savedSearchService.getSavedSearches(
      1,
      user.userProfile
    );

    expect(searches2.length).toBe(0);

    await deleteUser(user.userProfile.id);
  });

  it("should not find search for this user to delete it", async () => {
    let user;
    try {
      user = await register(
        "testUnit2",
        "testUnit2@unit.testUnit",
        "testUnit2"
      );

      const search = await savedSearchService.deleteSavedSearch(
        "1testunit",
        user.userProfile
      );
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("Saved search not found for this user");
    }
  });
});
