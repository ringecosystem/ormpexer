import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  ORMP_HashImportedEntity
} from "generated";
const { MockDb, ORMP, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  oRMP_HashImportedCount: BigInt(0),
  oRMP_MessageAcceptedCount: BigInt(0),
  oRMP_MessageAssignedCount: BigInt(0),
  oRMP_MessageDispatchedCount: BigInt(0),
  oRMPUpgradeablePort_MessageRecvCount: BigInt(0),
  oRMPUpgradeablePort_MessageSentCount: BigInt(0),
  signaturePub_SignatureSubmittionCount: BigInt(0),
};

describe("ORMP contract HashImported event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock ORMP contract HashImported event
  const mockORMPHashImportedEvent = ORMP.HashImported.createMockEvent({
    oracle: Addresses.defaultAddress,
    chainId: 0n,
    channel: Addresses.defaultAddress,
    msgIndex: 0n,
    hash: "foo",
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = ORMP.HashImported.processEvent({
    event: mockORMPHashImportedEvent,
    mockDb: mockDbFinal,
  });

  it("ORMP_HashImportedEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualORMPHashImportedEntity = mockDbUpdated.entities.ORMP_HashImported.get(
      mockORMPHashImportedEvent.transactionHash +
        mockORMPHashImportedEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedORMPHashImportedEntity: ORMP_HashImportedEntity = {
      id:
        mockORMPHashImportedEvent.transactionHash +
        mockORMPHashImportedEvent.logIndex.toString(),
      oracle: mockORMPHashImportedEvent.params.oracle,
      chainId: mockORMPHashImportedEvent.params.chainId,
      channel: mockORMPHashImportedEvent.params.channel,
      msgIndex: mockORMPHashImportedEvent.params.msgIndex,
      hash: mockORMPHashImportedEvent.params.hash,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualORMPHashImportedEntity, expectedORMPHashImportedEntity, "Actual ORMPHashImportedEntity should be the same as the expectedORMPHashImportedEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      oRMP_HashImportedCount: MOCK_EVENTS_SUMMARY_ENTITY.oRMP_HashImportedCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual ORMPHashImportedEntity should be the same as the expectedORMPHashImportedEntity");
  });
});
