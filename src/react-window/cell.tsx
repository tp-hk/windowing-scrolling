import { FC, CSSProperties, ReactNode } from 'react';

interface CellProps {
    children: ReactNode;
    style?: CSSProperties;
}

export const Cell: FC<CellProps> = (props) => {
  const colStyle: CSSProperties = {
    ...(props.style ?? {}),
    borderRight: '1px sold #323232',
  }
  return <div style={colStyle}>{props.children}</div>
}
