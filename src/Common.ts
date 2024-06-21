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

export const ADDRESS_RELAYER = [
  "0x114890eB7386F94eae410186F20968bFAf66142a",
  "0xFF9b99c9F654DAFB00a9EbEd42D221b261ceB8a6", // TZGjiJcoqUo6JSZeYvrwN6qvpEcLm21QbG
];
export const ADDRESS_ORACLE = [
  "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
  "0x266Aa1Ef524b1D13C92bF3CC57cA7b12a0C72aB1", // TDULRJrJ2bbsvW3KKtEnnq9moPn5PyUWpd
];
export const ADDRESS_SIGNATURE = [
  "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
  "0x924A4b87900A8CE8F8Cf62360Db047C4e4fFC1a3", // TPJifBA5MvFf918VYnajd2XmEept4iBX55
];

