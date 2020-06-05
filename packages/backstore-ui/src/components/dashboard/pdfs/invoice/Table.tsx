import React from 'react';
import { View, Text } from '@react-pdf/renderer';

interface CellProps {
  text: string;
  width: number;
  header?: boolean;
}

const Cell = ({ text, width, header }: CellProps) => {
  return (
    <View style={{ width, margin: '0 4px' }}>
      <Text style={{ fontWeight: header ? 'bold' : 'normal' }}>{text}</Text>
    </View>
  );
};

interface RowProps {
  cellWidths: CellProps['width'][];
  items: Array<{ text: CellProps['text'] }>;
  header?: boolean;
}

const Row = ({ cellWidths, items, header }: RowProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottom: header ? '1px solid #a6a1a1' : undefined,
        margin: '4px 0',
      }}
    >
      {items.map((item, index) => {
        return (
          <Cell
            key={index}
            header={header}
            width={cellWidths[index]}
            {...item}
          />
        );
      })}
    </View>
  );
};

export const Table = ({
  cellWidths,
  rows,
}: {
  cellWidths: RowProps['cellWidths'];
  rows: RowProps['items'][];
}) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      {rows.map((row, index) => {
        return (
          <Row
            key={index}
            header={index === 0}
            cellWidths={cellWidths}
            items={row}
          />
        );
      })}
    </View>
  );
};
