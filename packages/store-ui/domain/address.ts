export interface Address {
  _id: string;
  addressFor: string;
  name: string;
  country: string;
  region?: string;
  city: string;
  zip: string;
  street: string;
  person: string;
  phoneNumber: string;
}
