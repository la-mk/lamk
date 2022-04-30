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

export const AuthHandler = ({
  storeId,
  showModal,
  onClose,
  onAuthSuccess,
  onLoading,
}: {
  storeId: string;
  showModal: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User | undefined) => void;
  onLoading: (isLoading: boolean) => void;
}) => {
  const { t } = useTranslation();
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
      try {
        const accessToken = await sdk.auth.getAccessToken();
        if (accessToken && !isTokenValid(accessToken)) {
          onAuthSuccess(undefined);
        }
      } catch (err) {
        console.error(err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [onAuthSuccess]);

  useEffect(() => {
    (async () => {
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
          onAuthSuccess(undefined);
        } else if (authInfo) {
          onAuthSuccess(authInfo.user);
        }
      } catch (err) {
        toast.error("Failed to retrieve login information");
      } finally {
        onLoading(false);
      }
    })();
  }, [onAuthSuccess, onLoading]);

  const handleForgotPasswordSubmitted = async ({ formData }: any) => {
    try {
      await resetPassword([formData.email.toLowerCase(), storeId]);
      setForgotPasswordDone(true);
    } catch (err) {
      // TODO: Translate
      toast.error("Something went wrong while resetting password");
    }
  };

  const handleLogin = async (data: any) => {
    try {
      onLoading(true);
      await login([{ ...data, email: data.email?.toLowerCase() }, "local"]);
      const authInfo = await sdk.auth.getAuthentication();
      if (!authInfo) {
        toast.error("failed to get user information");
      } else {
        onAuthSuccess(authInfo?.user);
      }

      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      onLoading(false);
    }
  };

  const handleSignup = async (data: any) => {
    try {
      onLoading(true);
      await signup([{ ...data }, "local"]);
      const authInfo = await sdk.auth.getAuthentication();
      if (!authInfo) {
        toast.error("failed to get user information");
      } else {
        onAuthSuccess(authInfo?.user);
      }

      onClose();
    } catch (err) {
      toast.error("Failed to sign up");
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
              privacyPolicyLink="/legal/privacy"
              termsOfServiceLink="/legal/terms-of-use"
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
