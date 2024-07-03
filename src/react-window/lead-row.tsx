import { FC, useContext } from 'react';
import { IAssignee, DataContext, itemStatusMap } from './api';

interface LeadRowProps {
  style: CSSStyleRule;
  assignee: IAssignee;
}

export const LeadRow: FC<LeadRowProps> = ({ style = {}, assignee }) => {
  const { updateMap, rowMap: itemStatusMap } = useContext(DataContext);
  const { name } = assignee;

  const rowStyle = {
    ...style,
    borderBottom: '1px solid #000',
    backgroundColor: 'grey',
    fontWeight: 700,
  };

  const handleClick = () => {
    const teamMembers = [...itemStatusMap.values()].filter(person => person.assignments.assignee.leadId === assignee.id);
    console.log(teamMembers.map(m => m.assignments.assignee.name).join(', '));

    // const deleteIds = teamMembers.map(row => row.assignments.assignee.id);
    // const editedMap = new Map();
    // const allRows = [...itemStatusMap.values()];
    // allRows.forEach(row => {
    //   if (!deleteIds.includes(row.assignments.assignee.id)) {
    //     editedMap.set(key, itemStatusMap.get(key));
    //   }
    // });

    updateMap({
      delete: editedMap
    });
  }

  return <div style={rowStyle} onClick={handleClick}>{name} team</div>;
}

