import React, { useState, useEffect, useRef } from 'react';
import env from '../../common/env';

const TEST_ENDPOINT = 'https://entegrasyon.asseco-see.com.tr/fim/est3Dgate';
const PROD_ENDPOINT = 'https://epay.halkbank.mk/fim/est3Dgate';

interface NestPayData {
  clientId: string;
  orderId: string;
  orderTotal: number;
  currencyCode: number;
  language: string;
  okUrl: string;
  failUrl: string;
  transactionType: 'Auth';
}

interface NestPayProps {
  target: string;
  data: NestPayData;
}

// Nestpay is used by Halkbank
export const NestPay = ({ target, data }: NestPayProps) => {
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hash, setHash] = useState('');
  const [randomString] = useState(
    Date.now().toString() + Math.round(Math.random() * 10000),
  );
  const submitButtonRef = useRef(null);
  // For denars, the value has to be round to .0, .25, .5, .75, or 1, but its easier to just round it up or down.
  const roundedTotal = Math.round(data.orderTotal).toString();

  // The order matters here. The clientKey is private, so we need to add that and calculate the hash on the server-side.
  const hashContent =
    data.clientId +
    data.orderId +
    roundedTotal +
    data.okUrl +
    data.failUrl +
    data.transactionType +
    randomString;

  // +data.clientKey;

  useEffect(() => {
    if (!hashContent) {
      return;
    }

    getHash.then(setHash);
  }, [hashContent]);

  useEffect(() => {
    if (hasSubmitted) {
      return;
    }

    if (hash && submitButtonRef.current) {
      submitButtonRef.current.click();
      setHasSubmitted(true);
    }
  }, [submitButtonRef, hash, hasSubmitted]);

  return (
    <form
      method='post'
      action={env.NODE_ENV === 'production' ? PROD_ENDPOINT : TEST_ENDPOINT}
      target={target}
    >
      <input type='hidden' name='clientid' value={data.clientId} />
      <input type='hidden' name='oid' value={data.orderId} />
      <input type='hidden' name='amount' value={roundedTotal} />
      <input
        type='hidden'
        name='currency'
        value={data.currencyCode.toString()}
      />
      <input type='hidden' name='trantype' value={data.transactionType} />
      <input type='hidden' name='okUrl' value={data.okUrl} />
      <input type='hidden' name='failUrl' value={data.failUrl} />
      {/* If we pass callbackUrl there is an error, it seems you can use it only if the bank allows you too. */}
      {/* <input type='hidden' name='callbackUrl' value={data.callbackUrl} /> */}
      <input type='hidden' name='lang' value={data.language} />
      <input type='hidden' name='rnd' value={randomString} />
      <input type='hidden' name='refreshtime' value='3' />
      <input type='hidden' name='encoding' value='utf-8' />
      <input type='hidden' name='storetype' value='3d_pay_hosting' />
      <input type='hidden' name='hash' value={hash} />

      <input style={{ display: 'none' }} ref={submitButtonRef} type='submit' />
    </form>
  );
};
