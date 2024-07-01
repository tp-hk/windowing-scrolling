import { FC } from 'react';
import { IAssignee } from './api';

interface LeadRowProps {
  style: CSSStyleRule;
  assignee: IAssignee;
}

export const LeadRow: FC<LeadRowProps> = ({ style = {}, assignee }) => {
  const { name } = assignee;

  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000',
    backgroundColor: 'grey',
    fontWeight: 700,
  };

  const handleClick = () => {

  }

  return <div style={rowStyle} onClick={handleClick}>{name} team</div>;
}

