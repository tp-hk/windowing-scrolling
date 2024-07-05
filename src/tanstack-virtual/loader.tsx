import { FC, useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IDisplayRow, data } from './api';
import { Row } from './row';

export const Loader: FC = () => {
    const [displayedItems, setDisplayedItems] = useState<IDisplayRow[]>([]); 
    useEffect(() => {
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
        setDisplayedItems(items);
    }, []);

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: displayedItems.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 30 * (5 + 1),
    });

    const virtualizedItems = virtualizer.getVirtualItems();

    return (
        <div
        ref={parentRef}
        className="List"
        style={{
          height: 300,
          width: `100%`,
          overflowY: 'auto',
          contain: 'strict',
          border: '1px solid #000',
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
    )
}