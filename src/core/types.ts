export interface MuniInfo {
  muniCode: string;
  prefName: string;
  muniName: string;
}

export interface RentRecord {
  muniCode: string;
  prefName: string;
  muniName: string;
  rentPerSqm: number;
  surveyYear: number;
}

export interface RentDataset {
  surveyYear: number;
  generatedAt: string;
  records: RentRecord[];
}

export type RentDisplayViewModel =
  | { hasData: true; title: string; rentText: string; note: string }
  | { hasData: false; title: string; note: string };

export type LocationStatus =
  | { kind: 'idle' }
  | { kind: 'requesting' }
  | { kind: 'unsupported' }
  | { kind: 'denied' }
  | { kind: 'error'; message: string }
  | { kind: 'muniUnresolved' }
  | { kind: 'located'; muni: MuniInfo };
