import {EventsSummaryEntity, MessageProgressEntity} from "generated";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

export const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  oRMP_HashImportedCount: BigInt(0),
  oRMP_MessageAcceptedCount: BigInt(0),
  oRMP_MessageAssignedCount: BigInt(0),
  oRMP_MessageDispatchedCount: BigInt(0),
  oRMPUpgradeablePort_MessageRecvCount: BigInt(0),
  oRMPUpgradeablePort_MessageSentCount: BigInt(0),
  signaturePub_SignatureSubmittionCount: BigInt(0),
};

export const INITIAL_MESSAGE_PROGRESS: MessageProgressEntity = {
  id: '',
  total: BigInt(0),
  inflight: BigInt(0),
};
