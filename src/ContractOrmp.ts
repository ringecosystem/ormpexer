import {
  EventsSummaryEntity,
  ORMP_HashImportedEntity,
  ORMP_MessageAcceptedEntity,
  ORMP_MessageAssignedEntity,
  ORMP_MessageDispatchedEntity,
  ORMPContract
} from "generated";
import {GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY} from "./Common";


ORMPContract.HashImported.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPContract.HashImported.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_HashImportedCount: currentSummaryEntity.oRMP_HashImportedCount + BigInt(1),
  };

  const oRMP_HashImportedEntity: ORMP_HashImportedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    oracle: event.params.oracle,
    chainId: event.params.chainId,
    channel: event.params.channel,
    msgIndex: event.params.msgIndex,
    hash: event.params.hash,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_HashImported.set(oRMP_HashImportedEntity);
});
ORMPContract.MessageAccepted.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPContract.MessageAccepted.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageAcceptedCount: currentSummaryEntity.oRMP_MessageAcceptedCount + BigInt(1),
  };

  const oRMP_MessageAcceptedEntity: ORMP_MessageAcceptedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    msgHash: event.params.msgHash,
    channel: event.params.message[0],
    index: event.params.message[1],
    fromChainId: event.params.message[2],
    from: event.params.message[3],
    toChainId: event.params.message[4],
    to: event.params.message[5],
    gasLimit: event.params.message[6],
    encoded: event.params.message[7],
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_MessageAccepted.set(oRMP_MessageAcceptedEntity);
});
ORMPContract.MessageAssigned.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPContract.MessageAssigned.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageAssignedCount: currentSummaryEntity.oRMP_MessageAssignedCount + BigInt(1),
  };

  const oRMP_MessageAssignedEntity: ORMP_MessageAssignedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    msgHash: event.params.msgHash,
    oracle: event.params.oracle,
    relayer: event.params.relayer,
    oracleFee: event.params.oracleFee,
    relayerFee: event.params.relayerFee,
    params: event.params.params,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_MessageAssigned.set(oRMP_MessageAssignedEntity);
});
ORMPContract.MessageDispatched.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPContract.MessageDispatched.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageDispatchedCount: currentSummaryEntity.oRMP_MessageDispatchedCount + BigInt(1),
  };

  const oRMP_MessageDispatchedEntity: ORMP_MessageDispatchedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    msgHash: event.params.msgHash,
    dispatchResult: event.params.dispatchResult,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_MessageDispatched.set(oRMP_MessageDispatchedEntity);
});