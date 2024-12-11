import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Customer = {
  _id: ObjectId;
  legalName: string;
  address: string;
  phoneNumber: string;
  email: string;
  accountId: string;
  envelopes: Envelope[];
}


type Envelope = {
  envelopeId: string;
  templateId: string;
  envelopeStatus: EnvelopeStatus[]
}

type EnvelopeStatus = {
  envelopeStatus: string;
  date: Date;
  author: "customer" | "user";
  authoredBy: string;
}

