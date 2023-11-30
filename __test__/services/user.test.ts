import dotenv from "dotenv";
import { describe, it, expect, beforeAll } from "@jest/globals";
import mongoose from "mongoose";

import * as userService from "../../src/services/user.service";
import { register } from "../../src/services/auth.service";

describe("Test user service", () => {
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

  it("should be able to get a user profile", async () => {
    const user = await register(
      "testUnit1",
      "testUnit1@unit.testUnit",
      "testUnit1"
    );

    const userProfile = await userService.getUserProfile(user.userProfile.id);

    expect(userProfile.name).toBe("testUnit1");
    expect(userProfile.email).toBe("testUnit1@unit.testUnit");

    await userService.deleteUser(user.userProfile.id);
  });

  it("should be able to delete a user", async () => {
    const user = await register(
      "testUnit1",
      "testUnit1@unit.testUnit",
      "testUnit1"
    );

    const response = await userService.deleteUser(user.userProfile.id);

    expect(response.message).toBe("User deleted");
  });
});
