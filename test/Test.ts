import assert from "assert";
import { ORMP_HashImported, TestHelpers } from "generated";
const { MockDb, ORMP } = TestHelpers;

describe("ORMP contract AppConfigUpdated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ORMP contract AppConfigUpdated event
  const event = ORMP.HashImported.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it("ORMP_HashImported is created correctly", async () => {
    // Asserting that the entity in the mock database is the same as the expected entity
  });
});
