import {
  EventsSummaryEntity, MessagePortEntity,
  MessageProgressEntity,
  ORMPUpgradeablePort_MessageRecvEntity,
  ORMPUpgradeablePort_MessageSentEntity,
  ORMPUpgradeablePortContract,
} from "generated";
import {GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY, INITIAL_MESSAGE_PROGRESS} from "./Common";


ORMPUpgradeablePortContract.MessageRecv.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.MessagePort.load(event.params.msgId, undefined);
  context.MessageProgress.load(event.chainId.toString());
});

ORMPUpgradeablePortContract.MessageRecv.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMPUpgradeablePort_MessageRecvCount: currentSummaryEntity.oRMPUpgradeablePort_MessageRecvCount + BigInt(1),
  };

  const msgId = event.params.msgId;
  const oRMPUpgradeablePort_MessageRecvEntity: ORMPUpgradeablePort_MessageRecvEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

    msgId: msgId,
    result: event.params.result,
    returnData: event.params.returnData,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMPUpgradeablePort_MessageRecv.set(oRMPUpgradeablePort_MessageRecvEntity);


  // message port
  const storedMessagePort = context.MessagePort.get(msgId);
  const currentMessagePort: any = {
    id: msgId,
    ormp_id: msgId,
    protocol: 'ormp',
    status: event.params.result ? 1 : 2,
    targetBlockNumber: BigInt(event.blockNumber),
    targetBlockTimestamp: BigInt(event.blockTimestamp),
    targetChainId: BigInt(event.chainId),
    targetLogIndex: event.logIndex,
    targetPortAddress: event.srcAddress,
    targetTransactionHash: event.transactionHash,
    targetTransactionIndex: event.transactionIndex,
  };
  context.MessagePort.set({
    ...storedMessagePort,
    ...currentMessagePort,
  });


  // decrease progress
  const mpId = event.chainId.toString();
  const messageProgress = context.MessageProgress.get(mpId);
  if (messageProgress) {
    const currentMessageProgress: MessageProgressEntity = messageProgress;
    const nextMessageProgress = {
      id: mpId,
      total: currentMessageProgress.total,
      inflight: currentMessageProgress.inflight - 1n,
    };
    context.MessageProgress.set(nextMessageProgress);
  }
});


ORMPUpgradeablePortContract.MessageSent.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  context.MessagePort.load(event.params.msgId, undefined);
  context.MessageProgress.load(event.chainId.toString());
});

ORMPUpgradeablePortContract.MessageSent.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMPUpgradeablePort_MessageSentCount: currentSummaryEntity.oRMPUpgradeablePort_MessageSentCount + BigInt(1),
  };

  const msgId = event.params.msgId;
  const oRMPUpgradeablePort_MessageSentEntity: ORMPUpgradeablePort_MessageSentEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

    msgId: msgId,
    fromDapp: event.params.fromDapp,
    toChainId: event.params.toChainId,
    toDapp: event.params.toDapp,
    message: event.params.message,
    params: event.params.params,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMPUpgradeablePort_MessageSent.set(oRMPUpgradeablePort_MessageSentEntity);

  // message full
  const storedMessagePort = context.MessagePort.get(msgId);
  const currentMessagePort: any = {
    id: msgId,
    ormp_id: msgId,
    protocol: 'ormp',
    payload: event.params.message,
    params: event.params.params,

    sourceChainId: BigInt(event.chainId),
    sourceBlockNumber: BigInt(event.blockNumber),
    sourceBlockTimestamp: BigInt(event.blockTimestamp),
    sourceTransactionHash: event.transactionHash,
    sourceTransactionIndex: event.transactionIndex,
    sourceLogIndex: event.logIndex,
    sourceDappAddress: event.params.fromDapp,
    sourcePortAddress: event.srcAddress,

    targetChainId: BigInt(event.params.toChainId),
    targetDappAddress: event.params.toDapp,
  };
  context.MessagePort.set({
    ...storedMessagePort,
    ...currentMessagePort,
    status: storedMessagePort ? storedMessagePort.status : 0,
  });

  // increase progress
  const mpId = event.chainId.toString();
  const messageProgress = context.MessageProgress.get(mpId);
  const currentMessageProgress: MessageProgressEntity = messageProgress ?? INITIAL_MESSAGE_PROGRESS;
  const nextMessageProgress = {
    id: mpId,
    total: currentMessageProgress.total + 1n,
    inflight: currentMessageProgress.inflight + 1n,
  };
  context.MessageProgress.set(nextMessageProgress);
});
