import {GLOBAL_EVENTS_SUMMARY_KEY, INITIAL_EVENTS_SUMMARY} from "./Common";
import {EventsSummaryEntity, SignaturePub_SignatureSubmittionEntity, SignaturePubContract} from "generated";


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
    blockNumber: BigInt(event.blockNumber),
    transactionHash: event.transactionHash,
    blockTimestamp: BigInt(event.blockTimestamp),

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
