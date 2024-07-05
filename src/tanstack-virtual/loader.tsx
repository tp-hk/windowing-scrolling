import { FC, useRef, useEffect, useState, Fragment } from 'react';
import { useVirtualizer, Range } from '@tanstack/react-virtual';
import { DAY_COUNT, IAssigneeJobs, IDisplayRow, data } from './api';
import { Row } from './row';
import { faker } from '@faker-js/faker';

enum RangeOption {
    Before,
    Within,
    After
}

const adaptData = (data: IAssigneeJobs[]) => {
    const items: IDisplayRow[] = [];
    for (let i=0; i<data.length; i++) {
        const item = data[i];
        if (item.assignee.id === item.assignee.leadId) {
            items.push({
                ...item,
                isLeadRow: true
            });
        }
        items.push({
            ...item,
            isLeadRow: false
        })
    }
    return items;
}

export const Loader: FC = () => {
    const [displayedItems, setDisplayedItems] = useState<IDisplayRow[]>([]); 
    const parentRef = useRef<HTMLDivElement>(null);
    const rangeRef = useRef<Range>({
        startIndex: 0, 
        endIndex: 0,
        overscan: 0,
        count: 0
    })

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
        console.log(`adding to ${assignee.name}`);
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
        console.log(`removing from ${assignee.name}`);

        data[rowIndex].jobs.pop();
        setDisplayedItems(adaptData(data));
    }

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
        }
    });

    const virtualizedItems = virtualizer.getVirtualItems();

    return (
        <Fragment>
            <div>
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
            <div
                ref={parentRef}
                className="List"
                style={{
                    height: 300,
                    width: `100%`,
                    overflowY: 'auto',
                    contain: 'strict',
                    border: '1px solid #000',
                    marginTop: '8px'
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