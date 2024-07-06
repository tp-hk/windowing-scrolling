import { FC, useRef, useEffect, useState, Fragment } from 'react';
import { useVirtualizer, Range } from '@tanstack/react-virtual';
import { DAY_COUNT, IAssigneeJobs, IDisplayRow, data, createAssignee, createJobsForDays, RangeOption } from './api';
import { Row } from './row';
import { faker } from '@faker-js/faker';
import { Header } from './header';

const adaptData = (data: IAssigneeJobs[]) => {
    const items: IDisplayRow[] = [];
    for (let i=0; i<data.length; i++) {
        const item = data[i];
        if (item.assignee.id === item.assignee.leadId) {
            items.push({
                ...item,
                isLeadRow: true,
                rowId: item.assignee.id + 1
            });
        }
        items.push({
            ...item,
            isLeadRow: false,
            rowId: item.assignee.id
        })
    }
    return items;
}

const defaultRange: Range = {
    startIndex: 0, 
    endIndex: 0,
    overscan: 0,
    count: 0
};

const leads = data.filter(assignment => assignment.assignee.isLead);

export const Loader: FC = () => {
    const [displayedItems, setDisplayedItems] = useState<IDisplayRow[]>([]); 
    const parentRef = useRef<HTMLDivElement>(null);
    const leadIndexRef = useRef(0);
    const rangeRef = useRef<Range>(defaultRange);

    const virtualizer = useVirtualizer({
        count: displayedItems.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 30 * (5 + 1),
        rangeExtractor: (range ) => {
            rangeRef.current = range;
            const indices: number[] = [];
            for (let i=range.startIndex; i<=range.endIndex; i++) {
                indices.push(i);
            }
            return indices;
        },
        getItemKey: (index) => {
            const row = displayedItems[index];
            return row.isLeadRow ? row.assignee.id + 1 : row.assignee.id; 
        }
    });

    const virtualizedItems = virtualizer.getVirtualItems();

    useEffect(() => {
        setDisplayedItems(adaptData(data));
    }, []);

    const getRowIndex = (rangeOption: RangeOption) => {
        let index = 0;
        if (rangeOption === RangeOption.Before) {
            index = rangeRef.current.startIndex - 10;
            index = index < 0 ? 0 : index;
        } else if (rangeOption === RangeOption.Within) {
            index = faker.number.int({
                min: rangeRef.current.startIndex,
                max: rangeRef.current.endIndex
            });
        } else {
            index = rangeRef.current.startIndex + 10;
            index = index > displayedItems.length - 1 ? displayedItems.length - 1 : index;
        }
        return index;
    }
    
    const addJob = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);

        const { assignee } = data[rowIndex];
        console.log(`adding job to ${assignee.name}`);
        data[rowIndex].jobs.push({
            id: faker.number.int(),
            dayIndex: faker.number.int({ min: 0, max: DAY_COUNT - 1}),
            location: faker.location.city(),
            assignee: assignee.id,
        });

        setDisplayedItems(adaptData(data));
    }

    const removeJob = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);

        const { assignee } = data[rowIndex];
        console.log(`removing job from ${assignee.name}`);

        data[rowIndex].jobs.pop();
        setDisplayedItems(adaptData(data));
    }

    const addAssignee = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);
        const lastRow = data[rowIndex - 1];
        let lastLeadId = -1;
        let isLead = false;
        if (lastRow) {
            lastLeadId = lastRow.assignee.leadId;
        } else {
            isLead = true;
        }
        const assignee = createAssignee(isLead, lastLeadId);
        const jobs = createJobsForDays(assignee.id);
        data.splice(rowIndex, 0, {
            assignee, 
            jobs
        });
        console.log(`added assignee ${assignee.name}`);
        setDisplayedItems(adaptData(data));
    }

    const removeAssignee = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);
        
        data.splice(rowIndex, 1);
        console.log(`removed assignee ${data[rowIndex].assignee.name}`);
        setDisplayedItems(adaptData(data));
    }

    const jumpToLead = () => {
        leadIndexRef.current += 1;
        const lead = leads[leadIndexRef.current];
        console.log(`scrolling to lead ${lead.assignee.name}`);
        const rowIndex = displayedItems.findIndex(item => item.assignee.id === lead.assignee.id) ?? 0;
        virtualizer.scrollToIndex(rowIndex);
    }

    return (
        <Fragment>
            <Header
                addJob={addJob}
                removeJob={removeJob}
                addAssignee={addAssignee}
                removeAssignee={removeAssignee}
                jumpToLead={jumpToLead}
            />
            <div
                ref={parentRef}
                className="List"
                style={{
                    height: 300,
                    width: `100%`,
                    overflowY: 'auto',
                    contain: 'strict',
                    border: '1px solid #000',
                    marginTop: '8px',
                }}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    <div      
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualizedItems?.[0]?.start ?? 0}px)`
                        }}
                    >
                    {
                        virtualizedItems.map((virtualRow => {
                            const assigneeJobs = displayedItems[virtualRow.index];
                            return (
                                <div 
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}>
                                        <Row rowData={assigneeJobs} />
                                </div>
                                
                            )
                        }))
                    }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}