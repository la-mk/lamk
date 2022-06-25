import { Media } from "./media";
import { Contact } from "./contact";
import { Company } from "./company";

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
  company?: Company;
  logo?: Media | null;
}
