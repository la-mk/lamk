import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
} from "@la-mk/blocks-ui";
import { ShoppingBag, User as UserIcon, LogOut, LogIn } from "react-feather";
import { useTheme } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { NavButton } from "./NavButton";
import { User } from "../../domain/user";
import { urls } from "../../tooling/url";

export interface AccountMenuProps {
  user?: User;
  handleLogout: () => void;
  handleLogin: () => void;
}

export const AccountMenu = ({
  user,
  handleLogout,
  handleLogin,
}: AccountMenuProps) => {
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const ownTheme = theme.sections.Header;
  return (
    <Menu>
      <MenuButton
        // eslint-disable-next-line
        as={React.forwardRef((props, ref) => (
          <NavButton
            ref={ref}
            {...props}
            // eslint-disable-next-line
            children={undefined}
            variant={ownTheme.account.variant}
            title={t("auth.account")}
            hideTitle
            icon={<UserIcon size="1.2rem" />}
            size="sm"
          />
        ))}
      />
      <MenuList>
        {user ? (
          <>
            <Link href={urls.account} passHref>
              <MenuItem as="a" icon={<UserIcon size="1.2rem" />}>
                {t("pages.myAccount")}
              </MenuItem>
            </Link>

            <Link href={urls.accountOrders} passHref>
              <MenuItem as="a" icon={<ShoppingBag size="1.2rem" />}>
                {t("pages.myOrders")}
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem onClick={handleLogout} icon={<LogOut size="1.2rem" />}>
              {t("auth.logout")}
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin} icon={<LogIn size="1.2rem" />}>
              {t("auth.login")}
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
