import { Addresses as StandardAddresses } from "../../templates/Standard/account/Addresses";
import { Addresses as ElegantAddresses } from "../../templates/Elegant/account/Addresses";
import { Templates } from "..";
import { User } from "../../domain/user";
import { Store } from "../../domain/store";

export interface AddressesProps {
  user: User;
  store: Store;
}

export const Addresses = ({
  template,
  user,
  store,
}: {
  template: Templates;
  user: User;
  store: Store;
}) => {
  switch (template) {
    case "standard":
      return <StandardAddresses user={user} store={store} />;
    case "elegant":
      return <ElegantAddresses user={user} store={store} />;
  }
};
