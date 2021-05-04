import React from 'react';
import { Invoice, InvoiceProps } from './Invoice';
import { PDFDownloadLink } from '@react-pdf/renderer';

const InvoiceDownloadLink = ({
  children,
  ...props
}: InvoiceProps & { children: React.ReactNode }) => {
  return (
    <PDFDownloadLink
      document={<Invoice {...props} />}
      fileName={`${props.store.slug}-${props.order._id}`}
    >
      {children}
    </PDFDownloadLink>
  );
};

export default InvoiceDownloadLink;
