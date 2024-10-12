import {
  MessageProgress,
  ORMPUpgradeablePort,
  ORMPUpgradeablePort_MessageRecv,
  ORMPUpgradeablePort_MessageSent,
} from "generated";


ORMPUpgradeablePort.MessageRecv.handler(async ({ event, context }) => {
  const msgId = event.params.msgId;

  const entity: ORMPUpgradeablePort_MessageRecv = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    chainId: BigInt(event.chainId),
    msgId: msgId,
    result: event.params.result,
    returnData: event.params.returnData,
  };

  context.ORMPUpgradeablePort_MessageRecv.set(entity);

  // message port
  const storedMessagePort = await context.MessagePort.get(msgId);
  const currentMessagePort: any = {
    id: msgId,
    ormp_id: msgId,
    protocol: 'ormp',
    // status: event.params.result ? 1 : 2,
    targetBlockNumber: BigInt(event.block.number),
    targetBlockTimestamp: BigInt(event.block.timestamp),
    targetChainId: BigInt(event.chainId),
    targetLogIndex: event.logIndex,
    targetPortAddress: event.srcAddress,
    targetTransactionHash: event.transaction.hash,
    targetTransactionIndex: event.transaction.transactionIndex,
  };
  context.MessagePort.set({
    ...storedMessagePort,
    ...currentMessagePort,
  });
});

ORMPUpgradeablePort.MessageSent.handler(async ({ event, context }) => {
  const msgId = event.params.msgId;

  const entity: ORMPUpgradeablePort_MessageSent = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
    blockTimestamp: BigInt(event.block.timestamp),

    chainId: BigInt(event.chainId),
    msgId: msgId,
    fromDapp: event.params.fromDapp,
    toChainId: event.params.toChainId,
    toDapp: event.params.toDapp,
    message: event.params.message,
    params: event.params.params,
  };

  context.ORMPUpgradeablePort_MessageSent.set(entity);


  // message port
  const storedMessagePort = await context.MessagePort.get(msgId);
  const currentMessagePort: any = {
    id: msgId,
    ormp_id: msgId,
    protocol: 'ormp',
    payload: event.params.message,
    params: event.params.params,

    sender: event.transaction.from,

    sourceChainId: BigInt(event.chainId),
    sourceBlockNumber: BigInt(event.block.number),
    sourceBlockTimestamp: BigInt(event.block.timestamp),
    sourceTransactionHash: event.transaction.hash,
    sourceTransactionIndex: event.transaction.transactionIndex,
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

  // message progress
  const progressTotal = await context.MessageProgress.get('total');
  const currentProgressTotal: MessageProgress = progressTotal ?? {
    id: 'total',
    amount: 0n
  } as MessageProgress;
  context.MessageProgress.set({...currentProgressTotal, amount: currentProgressTotal.amount + 1n});
  const progressInflight = await context.MessageProgress.get('inflight');
  const currentProgressInflight: MessageProgress = progressInflight ?? {
    id: 'inflight',
    amount: 0n
  } as MessageProgress;
  context.MessageProgress.set({...currentProgressInflight, amount: currentProgressInflight.amount + 1n});
});
