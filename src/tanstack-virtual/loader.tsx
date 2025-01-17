import { FC, useRef, useEffect, useState, Fragment } from 'react';
import { useVirtualizer, Range } from '@tanstack/react-virtual';
import { DAY_COUNT, IAssigneeJobs, IDisplayRow, data, createAssignee, createJobsForDays, RangeOption, RowType, fetch } from './api';
import { getRow } from './row';
import { faker } from '@faker-js/faker';
import { Header } from './header';

const defaultRange: Range = {
    startIndex: 0, 
    endIndex: 0,
    overscan: 0,
    count: 0
};

// TODO: break down adaptData to data-processing & inserting into itemsRef.current
const adaptData = (currentRows: IDisplayRow[], data: IAssigneeJobs[], addLoadingRow = true) => {
    const currentRowsClone = [...currentRows];
    const loadingRowIndex = currentRowsClone.findIndex(row => row.rowType === RowType.LoadingRow);
    if (addLoadingRow) {
        currentRowsClone.splice(loadingRowIndex, 1);
    }

    const newRows: IDisplayRow[] = [];
    for (let i=0; i<data.length; i++) {
        const item = data[i];
        if (item.assignee.id === item.assignee.leadId) {
            newRows.push({
                rowId: item.assignee.id + 1,
                rowType: RowType.LeadRow,
                rowData: item,
            });
        }
        newRows.push({
            rowId: item.assignee.id,
            rowType: RowType.AssignmentRow,
            rowData: item,
        });

        if (addLoadingRow && i === Math.round(data.length/2)) {
            newRows.push({
                rowId: -1,
                rowType: RowType.LoadingRow,
                rowData: null,
            });
        }
    }

    return [...currentRowsClone, ...newRows];
}

const FETCH_COUNT = 10;
let isMounted = false;

export const Loader: FC = () => {
    const [displayedItems, setDisplayedItems] = useState<IDisplayRow[]>([]); 
    const parentRef = useRef<HTMLDivElement>(null);
    // const leadIndexRef = useRef(0);
    const rangeRef = useRef<Range>(defaultRange);
    const cursorRef = useRef(0);
    const itemsRef = useRef<IDisplayRow[]>([]);

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
        // getItemKey: (index) => {
        //     const row = displayedItems[index];

        //     return row.rowType === RowType.LeadRow ? row.rowData!.assignee.id + 1 : 
        //     row.rowType === RowType.AssignmentRow ? row.rowData!.assignee.id : -1; 
        // }
    });

    const virtualizedItems = virtualizer.getVirtualItems();

    const fetchData = async () => {
        console.log(`fetching...${cursorRef.current} - ${cursorRef.current + FETCH_COUNT}`);
        const fetchedData = await fetch(cursorRef.current, FETCH_COUNT);
        cursorRef.current = cursorRef.current + FETCH_COUNT; // NOT cursorRef.current + FETCH_COUNT + 1

        const newRows = adaptData(itemsRef.current ?? [], fetchedData);
        itemsRef.current = newRows;
        setDisplayedItems(itemsRef.current);
    }

    useEffect(() => {
        if (!isMounted) {
            (async function () {
                await fetchData();
            }());
        }

        // workaround for the double-mount issue
        isMounted = true;
    }, []);

    useEffect(() => {
        const scrollCallback = () => {
            console.log(`direction: ${virtualizer.scrollDirection}`);
        };
        if (parentRef.current) {
            parentRef.current!.addEventListener('scroll', scrollCallback);

        }

        return (() => {
            if (parentRef.current) {
                parentRef.current!.removeEventListener('scroll', scrollCallback);
            }
        })
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
        const rowData = displayedItems[rowIndex].rowData;
        if (!rowData) {
            return;
        }
        const { assignee } = rowData;
        console.log(`adding job to ${assignee.name}`);

        // supposedly server side operation
        const dataIndex = data.findIndex(item => item.assignee.id === assignee.id);
        if (dataIndex === -1) {
            return;
        }
        data[dataIndex].jobs.push({
            id: faker.number.int(),
            dayIndex: faker.number.int({ min: 0, max: DAY_COUNT - 1}),
            location: faker.location.city(),
            assignee: assignee.id,
        });

        // client side operation
        setDisplayedItems([...itemsRef.current]);
    }

    const removeJob = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);
        
        const rowData = displayedItems[rowIndex].rowData;
        if (!rowData) {
            return;
        }
        const { assignee } = rowData;
        console.log(`removing job from ${assignee.name}`);

        // supposedly server side operation
        const dataIndex = data.findIndex(item => item.assignee.id === assignee.id);
        if (dataIndex === -1) {
            return;
        }
        data[dataIndex].jobs.pop();
 
        // client side operation
        setDisplayedItems([...itemsRef.current]);
    }

    // TODO: buggy
    const addAssignee = (rangeOption: RangeOption) => {
        const origRowIndex = getRowIndex(rangeOption);
        const rowIndex = 1; // origRowIndex === 0 ? 1 : origRowIndex;
        const lastRow = displayedItems[rowIndex - 1];
        if (!lastRow.rowData) {
            return;
        }

        let lastLeadId = -1;
        let isLead = false;
        if (lastRow?.rowData?.assignee) {
            lastLeadId = lastRow.rowData.assignee.leadId;
        } else {
            isLead = true;
        }
        const assignee = createAssignee(isLead, lastLeadId);
        const jobs = createJobsForDays(assignee.id);

        // supposedly server side operation
        const assignment: IAssigneeJobs = {
            assignee, 
            jobs
        };
        console.log(`add to ${rowIndex}: assignee ${assignee.name}`);
        data.splice(rowIndex, 0, assignment);


        // TODO: assignment will be push to the end of of itemsRef.current regardless of rowIndex
        const newRows = adaptData(itemsRef.current, [assignment], false);
        itemsRef.current = newRows;
        setDisplayedItems(itemsRef.current);
    }

    // TODO: buggy
    const removeAssignee = (rangeOption: RangeOption) => {
        const rowIndex = getRowIndex(rangeOption);
        const row = displayedItems[rowIndex];
        if (!row.rowData) {
            return;
        }
        
        // supposedly server side operation
        const dataIndex = data.findIndex(item => item.assignee.id === row.rowData!.assignee.id);
        if (dataIndex === -1) {
            return;
        }
        console.log(`removed assignee ${data[dataIndex].assignee.name}`);
        data.splice(dataIndex, 1);

        const itemsClone = [...itemsRef.current];
        itemsClone.splice(rowIndex, 1);
        setDisplayedItems(itemsClone);
    }

    return (
        <Fragment>
            <Header
                addJob={addJob}
                removeJob={removeJob}
                addAssignee={addAssignee}
                removeAssignee={removeAssignee}
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
                        id="list"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualizedItems?.[0]?.start ?? 0}px)`
                        }}
                    >
                    {
                        virtualizedItems.map(((virtualRow) => {
                            const row = displayedItems[virtualRow.index];
                            return (
                                <div 
                                    key={virtualRow.key}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}>
                                        {getRow({ row, fetchData})}
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