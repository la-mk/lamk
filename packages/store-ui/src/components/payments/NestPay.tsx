import React, { useState, useEffect, useRef } from 'react';
import * as stringToArrayBuffer from 'string-to-arraybuffer';
import * as arrayBufferToString from 'arraybuffer-to-string';
import env from '../../common/env';

const TEST_ENDPOINT = 'https://entegrasyon.asseco-see.com.tr/fim/est3Dgate';
const PROD_ENDPOINT = 'https://epay.halkbank.mk/fim/est3Dgate';

// Nestpay is used by Halkbank
export const NestPay = ({ target, data }: any) => {
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hash, setHash] = useState('');
  const [randomString] = useState(Date.now().toString());
  const submitButtonRef = useRef(null);

  // The order matters here.
  const hashContent =
    data.clientId +
    data.orderId +
    data.orderTotal +
    data.okUrl +
    data.failUrl +
    data.transactionType +
    randomString +
    data.storeKey;

  useEffect(() => {
    // Subtle is not available in non https environments.
    if (hashContent && crypto?.subtle) {
      crypto.subtle
        .digest('SHA-1', stringToArrayBuffer(hashContent))
        .then(digest => {
          setHash(arrayBufferToString(digest, 'base64'));
        });
    }
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
      <input type='hidden' name='amount' value={data.orderTotal} />
      <input type='hidden' name='currency' value={data.currencyCode} />
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
