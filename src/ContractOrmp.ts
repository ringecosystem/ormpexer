import {
  EventsSummaryEntity, MessageProgressEntity,
  ORMP_HashImportedEntity,
  ORMP_MessageAcceptedEntity,
  ORMP_MessageAssignedEntity,
  ORMP_MessageDispatchedEntity,
  ORMPContract
} from "generated";
import {ADDRESS_ORACLE, ADDRESS_RELAYER, GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY,} from "./Common";


// ORMPContract.HashImported.loader(({event, context}) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

ORMPContract.HashImported.handlerAsync(async ({event, context}) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_HashImportedCount: currentSummaryEntity.oRMP_HashImportedCount + BigInt(1),
  };

  const oRMP_HashImportedEntity: ORMP_HashImportedEntity = {
    id: event.params.hash,
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

    srcChainId: event.params.chainId,
    channel: event.params.channel,
    msgIndex: event.params.msgIndex,
    targetChainId: BigInt(event.chainId),
    oracle: event.params.oracle,
    hash: event.params.hash,

    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_HashImported.set(oRMP_HashImportedEntity);
});

// ORMPContract.MessageAccepted.loader(({event, context}) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

ORMPContract.MessageAccepted.handlerAsync(async ({event, context}) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageAcceptedCount: currentSummaryEntity.oRMP_MessageAcceptedCount + BigInt(1),
  };

  const fromChainId = event.params.message[2];
  const oRMP_MessageAcceptedEntity: ORMP_MessageAcceptedEntity = {
    id: event.params.msgHash,
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

    msgHash: event.params.msgHash,
    channel: event.params.message[0],
    index: event.params.message[1],
    fromChainId: fromChainId,
    from: event.params.message[3],
    toChainId: event.params.message[4],
    to: event.params.message[5],
    gasLimit: event.params.message[6],
    encoded: event.params.message[7],
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    oracle: undefined,
    oracleAssigned: undefined,
    oracleAssignedFee: undefined,
    relayer: undefined,
    relayerAssigned: undefined,
    relayerAssignedFee: undefined,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_MessageAccepted.set(oRMP_MessageAcceptedEntity);
});


// ORMPContract.MessageAssigned.loader(({event, context}) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

ORMPContract.MessageAssigned.handlerAsync(async ({event, context}) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageAssignedCount: currentSummaryEntity.oRMP_MessageAssignedCount + BigInt(1),
  };

  const oRMP_MessageAssignedEntity: ORMP_MessageAssignedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

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

  if (ADDRESS_RELAYER.includes(event.params.relayer)) {
    const storedMessageAccepted = await context.ORMP_MessageAccepted.get(event.params.msgHash);
    if (storedMessageAccepted) {
      context.ORMP_MessageAccepted.set({
        ...storedMessageAccepted,
        relayer: event.params.relayer,
        relayerAssigned: true,
        relayerAssignedFee: event.params.relayerFee,
      });
    }
  }

  if (ADDRESS_ORACLE.includes(event.params.oracle)) {
    const storedMessageAccepted = await context.ORMP_MessageAccepted.get(event.params.msgHash);
    if (storedMessageAccepted) {
      context.ORMP_MessageAccepted.set({
        ...storedMessageAccepted,
        oracle: event.params.oracle,
        oracleAssigned: true,
        oracleAssignedFee: event.params.oracleFee,
      });
    }
  }
});

// ORMPContract.MessageDispatched.loader(({event, context}) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

ORMPContract.MessageDispatched.handlerAsync(async ({event, context}) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMP_MessageDispatchedCount: currentSummaryEntity.oRMP_MessageDispatchedCount + BigInt(1),
  };

  const oRMP_MessageDispatchedEntity: ORMP_MessageDispatchedEntity = {
    id: event.params.msgHash,
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

    targetChainId: BigInt(event.chainId),
    msgHash: event.params.msgHash,
    dispatchResult: event.params.dispatchResult,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMP_MessageDispatched.set(oRMP_MessageDispatchedEntity);


  // message port
  const storedMessagePort = await context.MessagePort.get(event.params.msgHash);
  const currentMessagePort: any = {
    id: event.params.msgHash,
    ormp_id: event.params.msgHash,
    protocol: 'ormp',
    status: event.params.dispatchResult ? 1 : 2,
  };
  context.MessagePort.set({
    ...storedMessagePort,
    ...currentMessagePort,
  });

  // message progress
  const progressInflight = await context.MessageProgress.get('inflight');
  const currentProgressInflight: MessageProgressEntity = progressInflight ?? {
    id: 'inflight',
    amount: 0n
  } as MessageProgressEntity;
  context.MessageProgress.set({...currentProgressInflight, amount: currentProgressInflight.amount - 1n});

  if (!event.params.dispatchResult) {
    const progressFailed = await context.MessageProgress.get('failed');
    const currentProgressFailed: MessageProgressEntity = progressFailed ?? {
      id: 'failed',
      amount: 0n
    } as MessageProgressEntity;
    context.MessageProgress.set({...currentProgressFailed, amount: currentProgressFailed.amount + 1n});
  }
});
