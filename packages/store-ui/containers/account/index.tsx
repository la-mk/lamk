import { Account as StandardAccount } from "../../templates/Standard/account/Account";
import { Account as ElegantAccount } from "../../templates/Elegant/account/Account";
import { Templates } from "..";
import { User } from "../../domain/user";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

export interface AccountProps {
  user?: User;
}

export const Account = ({
  template,
  user,
}: {
  template: Templates;
  user?: User;
}) => {
  useProtectedRoute();

  switch (template) {
    case "standard":
      return <StandardAccount user={user} />;
    case "elegant":
      return <ElegantAccount user={user} />;
  }
};
