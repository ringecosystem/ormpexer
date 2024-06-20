import {
  EventsSummaryEntity, MessageProgressEntity,
  ORMPUpgradeablePort_MessageRecvEntity,
  ORMPUpgradeablePort_MessageSentEntity,
  ORMPUpgradeablePortContract,
} from "generated";
import {GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY, INITIAL_MESSAGE_PROGRESS} from "./Common";


ORMPUpgradeablePortContract.MessageRecv.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPUpgradeablePortContract.MessageRecv.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMPUpgradeablePort_MessageRecvCount: currentSummaryEntity.oRMPUpgradeablePort_MessageRecvCount + BigInt(1),
  };

  const oRMPUpgradeablePort_MessageRecvEntity: ORMPUpgradeablePort_MessageRecvEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    msgId: event.params.msgId,
    result: event.params.result,
    returnData: event.params.returnData,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMPUpgradeablePort_MessageRecv.set(oRMPUpgradeablePort_MessageRecvEntity);

  // decrease progress
  const mpId = event.chainId.toString();
  const messageProgress = context.MessageProgress.get(mpId);
  if (messageProgress) {
    const currentMessageProgress: MessageProgressEntity = messageProgress;
    const nextMessageProgress = {
      id: mpId,
      total: currentMessageProgress.total,
      inflight: currentMessageProgress.inflight + 1,
    };
    context.MessageProgress.set(nextMessageProgress);
  }
});


ORMPUpgradeablePortContract.MessageSent.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ORMPUpgradeablePortContract.MessageSent.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    oRMPUpgradeablePort_MessageSentCount: currentSummaryEntity.oRMPUpgradeablePort_MessageSentCount + BigInt(1),
  };

  const oRMPUpgradeablePort_MessageSentEntity: ORMPUpgradeablePort_MessageSentEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    msgId: event.params.msgId,
    fromDapp: event.params.fromDapp,
    toChainId: event.params.toChainId,
    toDapp: event.params.toDapp,
    message: event.params.message,
    params: event.params.params,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ORMPUpgradeablePort_MessageSent.set(oRMPUpgradeablePort_MessageSentEntity);

  // increase progress
  const mpId = event.chainId.toString();
  const messageProgress = context.MessageProgress.get(mpId);
  const currentMessageProgress: MessageProgressEntity = messageProgress ?? INITIAL_MESSAGE_PROGRESS;
  const nextMessageProgress = {
    id: mpId,
    total: currentMessageProgress.total + 1,
    inflight: currentMessageProgress.inflight + 1,
  };
  context.MessageProgress.set(nextMessageProgress);
});
