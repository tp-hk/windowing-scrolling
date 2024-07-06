import { FC } from 'react';
import { IDisplayRow } from './api';

export const LoadingRow: FC = () => {
    const { rowData } = data;
    return (
        <div style={{
            height: `1px`,
            border: '1px solid #000',
            background: '#fff',
        }} />
    );
};