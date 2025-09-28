export interface FormData {
  name: string;
  dni: string;
  trainingName: string;
}

export interface Attendee extends FormData {
  id: number;
  signatureDataUrl: string;
  signatureTimestamp: string;
}
