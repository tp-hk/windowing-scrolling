import { FC } from 'react';
import { RangeOption } from './api';

interface HeaderProps {
    addJob: (rangeOption: RangeOption) => void;
    removeJob: (rangeOption: RangeOption) => void;
    addAssignee: (rangeOption: RangeOption) => void;
    removeAssignee: (rangeOption: RangeOption) => void;
    jumpToLead: () => void;
} 

export const Header: FC<HeaderProps> = ({
    addJob, removeJob, addAssignee, removeAssignee, jumpToLead
}) => {
    return <div>
        <div>
            Add/remove job
            <div>
                <div style={{
                    display: 'flex',
                    gap: '2px'
                }}>
                    <button onClick={() => addJob(RangeOption.Before)}>+ before</button>
                    <button onClick={() => addJob(RangeOption.Within)}>+</button>
                    <button onClick={() => addJob(RangeOption.After)}>+ after</button>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '2px'
                }}>
                    <button onClick={() => removeJob(RangeOption.Before)}>- before</button>
                    <button onClick={() => removeJob(RangeOption.Within)}>-</button>
                    <button onClick={() => removeJob(RangeOption.After)}>- after</button>
                </div>
            </div>
        </div>
        {/* <div>
            Add/remove Assignee
            <div>
                <div style={{
                    display: 'flex',
                    gap: '2px'
                }}>
                    <button onClick={() => addAssignee(RangeOption.Before)}>+ before</button>
                    <button onClick={() => addAssignee(RangeOption.Within)}>+</button>
                    <button onClick={() => addAssignee(RangeOption.After)}>+ after</button>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '2px'
                }}>
                    <button onClick={() => removeAssignee(RangeOption.Before)}>- before</button>
                    <button onClick={() => removeAssignee(RangeOption.Within)}>-</button>
                    <button onClick={() => removeAssignee(RangeOption.After)}>- after</button>
                </div>
            </div>
        </div> */}
        <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
        }}>
            Jump to leads
            <button onClick={jumpToLead}>Jump to Lead</button>
        </div>
    </div>
}
