import { ObjectId } from "mongodb";

//TODO: This should also have company details
export interface Experience {
  _id: ObjectId; //This is mongoDb Id
  experiencePlatformId: string;
  experienceTitle: string;
  experienceDescription: string;
  experienceExtendedDescription: string;
  prices: (Money & {
    label: string;
  })[];
  experiencesImages: string[];
  experienceLocation: Address;
  experiencePlatform: "rezdy" | "fareharbour";
};

type Address = {
  city?: string | null;
  country?: string | null;
  postCode?: string | null;
  addressLine?: string | null;
  latitude: number;
  longitude: number;
};

type Money = {
  currency: string;
  amount: number;
};
