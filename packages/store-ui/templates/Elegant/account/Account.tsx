import React from "react";
import { useTranslation } from "next-i18next";
import { AccountProps } from "../../../containers/account";

export const Account = ({ user }: AccountProps) => {
  const { t } = useTranslation("translation");
  return null;
};
