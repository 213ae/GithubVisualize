import React from 'react'
import DataTable from '../../../conponents/DataTable'

export default function MyReposPage() {
    const params = {
        label: 'My Repos',
        field: 'repos',
    };

    return (
        <div className="my-repos-page" >
            <DataTable {...params} />
        </div>
    )
}