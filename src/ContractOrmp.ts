import {
  MessageProgress,
  ORMP,
  ORMP_HashImported,
  ORMP_MessageAccepted,
  ORMP_MessageAssigned,
  ORMP_MessageDispatched,
} from "generated";
import { ADDRESS_RELAYER, ADDRESS_ORACLE } from "./Common";

ORMP.HashImported.handler(async ({ event, context }) => {
  const entity: ORMP_HashImported = {
    id: event.params.hash,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    srcChainId: event.params.chainId,
    channel: event.params.channel,
    msgIndex: event.params.msgIndex,
    targetChainId: BigInt(event.chainId),
    oracle: event.params.oracle,
    hash: event.params.hash,
  };

  context.ORMP_HashImported.set(entity);
});

ORMP.MessageAccepted.handler(async ({ event, context }) => {
  const fromChainId = event.params.message[2];

  const entity: ORMP_MessageAccepted = {
    id: event.params.msgHash,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    msgHash: event.params.msgHash,
    channel: event.params.message[0],
    index: event.params.message[1],
    fromChainId: fromChainId,
    from: event.params.message[3],
    toChainId: event.params.message[4],
    to: event.params.message[5],
    gasLimit: event.params.message[6],
    encoded: event.params.message[7],
    oracle: undefined,
    oracleAssigned: undefined,
    oracleAssignedFee: undefined,
    relayer: undefined,
    relayerAssigned: undefined,
    relayerAssignedFee: undefined,
  };

  context.ORMP_MessageAccepted.set(entity);
});

ORMP.MessageAssigned.handler(async ({ event, context }) => {
  const entity: ORMP_MessageAssigned = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    msgHash: event.params.msgHash,
    oracle: event.params.oracle,
    relayer: event.params.relayer,
    oracleFee: event.params.oracleFee,
    relayerFee: event.params.relayerFee,
    params: event.params.params,
  };

  context.ORMP_MessageAssigned.set(entity);

  if (ADDRESS_RELAYER.includes(event.params.relayer)) {
    const storedMessageAccepted = await context.ORMP_MessageAccepted.get(
      event.params.msgHash
    );
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
    const storedMessageAccepted = await context.ORMP_MessageAccepted.get(
      event.params.msgHash
    );
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

ORMP.MessageDispatched.handler(async ({ event, context }) => {
  const entity: ORMP_MessageDispatched = {
    id: event.params.msgHash,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    targetChainId: BigInt(event.chainId),
    msgHash: event.params.msgHash,
    dispatchResult: event.params.dispatchResult,
  };

  context.ORMP_MessageDispatched.set(entity);

  // message port
  const storedMessagePort = await context.MessagePort.get(event.params.msgHash);
  const currentMessagePort: any = {
    id: event.params.msgHash,
    ormp_id: event.params.msgHash,
    protocol: "ormp",
    status: event.params.dispatchResult ? 1 : 2,
  };
  context.MessagePort.set({
    ...storedMessagePort,
    ...currentMessagePort,
  });

  // message progress
  const progressInflight = await context.MessageProgress.get("inflight");
  const currentProgressInflight: MessageProgress =
    progressInflight ??
    ({
      id: "inflight",
      amount: 0n,
    } as MessageProgress);
  context.MessageProgress.set({
    ...currentProgressInflight,
    amount: currentProgressInflight.amount - 1n,
  });

  if (!event.params.dispatchResult) {
    const progressFailed = await context.MessageProgress.get("failed");
    const currentProgressFailed: MessageProgress =
      progressFailed ??
      ({
        id: "failed",
        amount: 0n,
      } as MessageProgress);
    context.MessageProgress.set({
      ...currentProgressFailed,
      amount: currentProgressFailed.amount + 1n,
    });
  }
});
