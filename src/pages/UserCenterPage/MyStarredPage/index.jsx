import React from 'react'
import DataTable from '../../../conponents/DataTable'

export default function MyStarredPage() {
    const params = {
        label: 'Starred Repos',
        field: 'starred',
    };

    return (
        <div className="starred-page" >
            <DataTable {...params} />
        </div>
    )
}