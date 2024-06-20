/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
    EventsSummaryEntity,
    ORMP_HashImportedEntity,
    ORMP_MessageAcceptedEntity,
    ORMP_MessageAssignedEntity,
    ORMP_MessageDispatchedEntity,
    ORMPContract,
    ORMPUpgradeablePort_MessageRecvEntity,
    ORMPUpgradeablePort_MessageSentEntity,
    ORMPUpgradeablePortContract,
    SignaturePub_SignatureSubmittionEntity,
    SignaturePubContract
} from "generated";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
    id: GLOBAL_EVENTS_SUMMARY_KEY,
    oRMP_HashImportedCount: BigInt(0),
    oRMP_MessageAcceptedCount: BigInt(0),
    oRMP_MessageAssignedCount: BigInt(0),
    oRMP_MessageDispatchedCount: BigInt(0),
    oRMPUpgradeablePort_MessageRecvCount: BigInt(0),
    oRMPUpgradeablePort_MessageSentCount: BigInt(0),
    signaturePub_SignatureSubmittionCount: BigInt(0),
};

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
