import { Media } from "./media";
import { Contact } from "./contact";

export interface Store {
  _id: string;
  name: string;
  slug: string;
  color: string;
  slogan?: string;
  customDomain?: string;
  preferences?: {
    currency?: string;
  };
  contact?: Contact;
  logo?: Media | null;
}
