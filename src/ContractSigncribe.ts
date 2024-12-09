import {
  SignaturePub,
  SignaturePub_SignatureSubmittion,
} from "generated";

SignaturePub.SignatureSubmittion.handler(async ({ event, context }) => {
  const entity: SignaturePub_SignatureSubmittion = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    chainId: event.params.chainId,
    channel: event.params.channel,
    signer: event.params.signer,
    msgIndex: event.params.msgIndex,
    signature: event.params.signature,
    data: event.params.data,
  };

  context.SignaturePub_SignatureSubmittion.set(entity);
});
