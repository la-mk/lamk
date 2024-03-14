import React, { useState, useEffect, useRef } from "react";
import { envvars } from "../../tooling/env";

interface NestPayData {
  clientId: string;
  orderId: string;
  orderTotal: number;
  currencyCode: number;
  language: string;
  okUrl: string;
  failUrl: string;
  transactionType: "Auth";
}

interface NestPayProps {
  target: string;
  data: NestPayData;
  getHashParts: (hashContent: string) => Promise<{ hash: string }>;
}

const HASH_ALGORITHM = "ver3";
const REFRESH_TIME = "3";
const STORE_TYPE = "3D_PAY_HOSTING";

// Nestpay is used by Halkbank
export const NestPay = ({ target, data, getHashParts }: NestPayProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [calculatedHashParts, setCalculatedHashParts] = useState<{
    hash: string;
  } | null>(null);
  const [randomNumber] = useState(Math.random().toString(36).substring(12));

  const submitButtonRef = useRef<HTMLInputElement>(null);
  // For denars, the value has to be round to .0, .25, .5, .75, or 1, but its easier to just round it up or down.
  const roundedTotal = Math.round(data.orderTotal).toString();

  // The order matters here. The fields need to be sorted alphabetically in ver3. Store key is added in the BE
  const hashContent = [
    roundedTotal,
    data.clientId,
    data.currencyCode.toString(),
    data.failUrl,
    HASH_ALGORITHM,
    data.language,
    data.orderId,
    data.okUrl,
    REFRESH_TIME,
    randomNumber,
    STORE_TYPE,
    data.transactionType,
  ].join("|");

  useEffect(() => {
    if (!hashContent) {
      return;
    }
    getHashParts(hashContent).then(setCalculatedHashParts);
  }, [hashContent]);

  useEffect(() => {
    if (hasSubmitted) {
      return;
    }

    if (calculatedHashParts?.hash && submitButtonRef.current) {
      submitButtonRef.current?.click?.();
      setHasSubmitted(true);
    }
  }, [submitButtonRef, calculatedHashParts, hasSubmitted]);

  return (
    <form
      method="post"
      action={envvars.NESTPAY_GATEWAY_ENDPOINT}
      target={target}
    >
      <input type="hidden" name="clientid" value={data.clientId} />
      <input type="hidden" name="oid" value={data.orderId} />
      <input type="hidden" name="amount" value={roundedTotal} />
      <input
        type="hidden"
        name="currency"
        value={data.currencyCode.toString()}
      />
      <input type="hidden" name="TranType" value={data.transactionType} />
      <input type="hidden" name="okUrl" value={data.okUrl} />
      <input type="hidden" name="failUrl" value={data.failUrl} />
      {/* If we pass callbackUrl there is an error, it seems you can use it only if the bank allows you too. */}
      {/* <input type='hidden' name='callbackUrl' value={data.callbackUrl} /> */}
      <input type="hidden" name="lang" value={data.language} />
      <input type="hidden" name="refreshtime" value={REFRESH_TIME} />
      <input type="hidden" name="encoding" value="utf-8" />
      <input type="hidden" name="hashAlgorithm" value={HASH_ALGORITHM} />
      <input type="hidden" name="storetype" value={STORE_TYPE} />
      <input type="hidden" name="rnd" value={randomNumber} />
      <input type="hidden" name="hash" value={calculatedHashParts?.hash} />

      <input style={{ display: "none" }} ref={submitButtonRef} type="submit" />
    </form>
  );
};
