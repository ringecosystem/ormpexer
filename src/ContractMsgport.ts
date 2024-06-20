import {
  EventsSummaryEntity,
  ORMPUpgradeablePort_MessageRecvEntity,
  ORMPUpgradeablePort_MessageSentEntity,
  ORMPUpgradeablePortContract,
  SignaturePub_SignatureSubmittionEntity,
  SignaturePubContract
} from "generated";
import {GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY} from "./Common";


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
});
SignaturePubContract.SignatureSubmittion.loader(({event, context}) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SignaturePubContract.SignatureSubmittion.handler(({event, context}) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    signaturePub_SignatureSubmittionCount: currentSummaryEntity.signaturePub_SignatureSubmittionCount + BigInt(1),
  };

  const signaturePub_SignatureSubmittionEntity: SignaturePub_SignatureSubmittionEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    chainId: event.params.chainId,
    channel: event.params.channel,
    signer: event.params.signer,
    msgIndex: event.params.msgIndex,
    signature: event.params.signature,
    data: event.params.data,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SignaturePub_SignatureSubmittion.set(signaturePub_SignatureSubmittionEntity);
});
