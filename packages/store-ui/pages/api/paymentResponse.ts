import { sdk } from '@sradevski/la-sdk';

export default async (req, res) => {
  try {
    const createRes = await sdk.orderPayments.create(req.body);
    res.statusCode = 200;
    if (
      createRes.transactions[0]?.status ===
      sdk.orderPayments.TransactionStatus.APPROVED
    ) {
      res.end('<body>Success!</body>');
    }

    res.end(`<body>${createRes.transactions[0].message}</body>`);
  } catch (err) {
    res.status = err.statusCode;
    res.end(`<body>${err.message}</body>`);
  }
};
