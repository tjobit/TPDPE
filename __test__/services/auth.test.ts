import dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "@jest/globals";
import mongoose from "mongoose";

import * as authService from "../../src/services/auth.service";
import { deleteUser } from "../../src/services/user.service";

describe("Test auth service", () => {
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

  it("should be able to create a user", async () => {
    const user = await authService.register(
      "testUnit",
      "testUnit@unit.testUnit",
      "testUnit"
    );

    expect(user).toHaveProperty("accessToken");
    expect(user).toHaveProperty("refreshToken");
    expect(user).toHaveProperty("userProfile");

    await deleteUser(user.userProfile.id);
  });

  it("should not be able to create a user with an existing email", async () => {
    let user;
    try {
      user = await authService.register(
        "testUnit",
        "testUnit@unit.testUnit",
        "testUnit"
      );
      await authService.register(
        "testUnit",
        "testUnit@unit.testUnit",
        "testUnit"
      );
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("This email is already registered");
    }
  });

  it("should be able to login a user", async () => {
    const user = await authService.register(
      "testUnit",
      "testUnit@unit.testUnit",
      "testUnit"
    );

    const login = await authService.login("testUnit@unit.testUnit", "testUnit");

    expect(login).toHaveProperty("accessToken");
    expect(login).toHaveProperty("refreshToken");
    expect(login).toHaveProperty("userProfile");

    await deleteUser(user.userProfile.id);
  });

  it("should not be able to login a user with an unregistered email", async () => {
    try {
      await authService.login("testUnit@unit.testUnit", "testUnit");
    } catch (error) {
      expect(error.message).toBe("This email is not registered");
    }
  });

  it("should not be able to login a user with the wrong password", async () => {
    let user;
    try {
      user = await authService.register(
        "testUnit",
        "testUnit@unit.testUnit",
        "testUnit"
      );

      await authService.login("testUnit@unit.testUnit", "notGoodPassword");
    } catch (error) {
      await deleteUser(user.userProfile.id);
      expect(error.message).toBe("Incorrect password");
    }
  });

  it("should be able to refresh a token", async () => {
    const user = await authService.register(
      "testUnit",
      "testUnit@unit.testUnit",
      "testUnit"
    );

    const newTokens = authService.refreshAuthToken(user.refreshToken);

    expect(newTokens).toHaveProperty("accessToken");
    expect(newTokens).toHaveProperty("refreshToken");

    await deleteUser(user.userProfile.id);
  });
});
