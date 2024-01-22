import React, { useEffect } from "react";
import {
  Modal,
  Flex,
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  Spinner,
  toast,
} from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useMutation } from "../../sdk/useMutation";
import { User } from "../../domain/user";
import { sdk } from "../../sdk/sdk";
import { urls } from "../../tooling/url";

const isTokenValid = (token: string) => {
  if (!token) {
    return false;
  }

  try {
    const tokenData = jwtDecode<JwtPayload>(token);
    const expirationTimestamp = tokenData.exp;
    const currentTimestamp = Date.now() / 1000;
    if (currentTimestamp > (expirationTimestamp ?? 0)) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
};

const isTokenExpiredError = (err: any) => {
  return err.data?.name === "TokenExpiredError";
};

const isTokenInvalidError = (err: any) => {
  return err.data?.name === "JsonWebTokenError";
};

// TODO: Clean up AuthHandler
export const AuthHandler = ({
  storeId,
  showModal,
  onClose,
  onAuthChanged,
  onLoading,
  user,
}: {
  storeId: string;
  showModal: boolean;
  onClose: () => void;
  onAuthChanged: (user: User | undefined) => void;
  onLoading: (isLoading: boolean) => void;
  user: User | undefined;
}) => {
  const { t } = useTranslation("translation");
  const [method, setMethod] = React.useState<
    "login" | "signup" | "forgotPassword"
  >("login");

  const [forgotPasswordDone, setForgotPasswordDone] = React.useState(false);
  const [login, isLoggingIn] = useMutation("auth", "login");
  const [signup, isSigningUp] = useMutation("auth", "signup");
  const [resetPassword, isResettingPassword] = useMutation(
    "auth",
    "resetPassword"
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
        // if (!user) {
        //   return;
        // }

        try {
          await sdk.auth.getCustomer();
        } catch (err: any) {
          if (err.response.status === 401) {
            onAuthChanged(undefined);
          }
        }
      } else {
        try {
          const accessToken = await sdk.auth.getAccessToken();
          if (accessToken && !isTokenValid(accessToken)) {
            sdk.auth.removeAccessToken();
            onAuthChanged(undefined);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [storeId, onAuthChanged]);

  useEffect(() => {
    (async () => {
      if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
        try {
          onLoading(true);
          const customer = await sdk.auth.getCustomer();
          if (customer) {
            onAuthChanged(customer);
          }
        } catch (err: any) {
          if (err.response.status !== 401) {
            console.error(err);
          }
        } finally {
          onLoading(false);
        }
      } else {
        try {
          onLoading(true);
          const accessToken = await sdk.auth.getAccessToken();
          const wasAuthenticated = Boolean(accessToken);
          if (accessToken && !isTokenValid(accessToken)) {
            sdk.auth.removeAccessToken();
          } else if (accessToken) {
            try {
              await sdk.auth.reauthenticate(true);
            } catch (inerr) {
              //Ignore error, since it means the user couldn't be reauthenticated
              if (isTokenExpiredError(inerr) || isTokenInvalidError(inerr)) {
                console.log(inerr);
              }
            }
          }

          const authInfo = await sdk.auth.getAuthentication();
          // It is a user whose token expired, we want to clear their session info
          if (!authInfo && wasAuthenticated) {
            onAuthChanged(undefined);
          } else if (authInfo) {
            onAuthChanged(authInfo.user);
          }
        } catch (err) {
          console.error(err);
          toast.error(t("results.genericError"));
        } finally {
          onLoading(false);
        }
      }
    })();
    // eslint-disable-next-line
  }, []);

  const handleForgotPasswordSubmitted = async ({ formData }: any) => {
    try {
      await resetPassword([formData.email.toLowerCase(), storeId]);
      setForgotPasswordDone(true);
    } catch (err) {
      console.error(err);
      toast.error(t("results.genericError"));
    }
  };

  const handleLogin = async (data: any) => {
    onLoading(true);
    if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
      try {
        await login([
          storeId,
          { ...data, email: data.email?.toLowerCase() },
          "local",
        ]);

        const customer = await sdk.auth.getCustomer();
        if (!customer) {
          toast.error(t("results.genericError"));
        } else {
          onAuthChanged(customer);
        }
        onClose();
      } catch (err: any) {
        if (err.response.status === 401) {
          toast.error(t("results.genericError"));
        } else {
          console.error(err);
        }
      } finally {
        onLoading(false);
      }
    } else {
      try {
        const authInfo = await sdk.auth.getAuthentication();
        if (!authInfo) {
          toast.error(t("results.genericError"));
        } else {
          onAuthChanged(authInfo?.user);
        }
        onClose();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      } finally {
        onLoading(false);
      }
    }
  };

  const handleSignup = async (data: any) => {
    try {
      onLoading(true);
      await signup([storeId, { ...data }, "local"]);
      if (storeId === "09b85672-cd92-4842-8c02-e90ea5b153c2") {
        const customer = await sdk.auth.getCustomer();
        if (!customer) {
          toast.error(t("results.genericError"));
        } else {
          onAuthChanged(customer);
        }
      } else {
        const authInfo = await sdk.auth.getAuthentication();
        if (!authInfo) {
          toast.error(t("results.genericError"));
        } else {
          onAuthChanged(authInfo?.user);
        }
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("results.genericError"));
    } finally {
      onLoading(false);
    }
  };

  const authSchema = sdk.utils.schema.pick(sdk.user.schema, [
    "email",
    "password",
  ]);

  return (
    <Modal
      maxWidth={["96%", "88%", "56%"]}
      isOpen={showModal}
      onClose={() => {
        onClose();
        setMethod("login");
        setForgotPasswordDone(false);
      }}
    >
      <Flex py={5} width="100%" direction="column" align="center">
        {method === "login" && (
          <Spinner isLoaded={!isLoggingIn}>
            <LoginForm
              schema={authSchema}
              logoUrl="/images/lamk-logo/horizontal.svg"
              login={handleLogin}
              onSignupNowClick={() => setMethod("signup")}
              onForgotPasswordClick={() => setMethod("forgotPassword")}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spinner>
        )}
        {method === "signup" && (
          <Spinner isLoaded={!isSigningUp}>
            <SignupForm
              schema={authSchema}
              logoUrl="/images/lamk-logo/horizontal.svg"
              privacyPolicyLink={urls.privacyPolicy}
              termsOfServiceLink={urls.termsOfUse}
              signup={handleSignup}
              onLoginNowClick={() => setMethod("login")}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spinner>
        )}
        {method === "forgotPassword" && (
          <Spinner isLoaded={!isResettingPassword}>
            <ForgotPasswordForm
              schema={sdk.utils.schema.pick(sdk.user.schema, ["email"])}
              hasSubmitted={forgotPasswordDone}
              onLoginInstead={() => setMethod("login")}
              onSubmit={handleForgotPasswordSubmitted}
              getErrorMessage={(errorName, context) =>
                t(`errors.${errorName}`, context)
              }
            />
          </Spinner>
        )}
      </Flex>
    </Modal>
  );
};
