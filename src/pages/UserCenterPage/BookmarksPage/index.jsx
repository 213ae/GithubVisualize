import React from 'react'
import DataTable from '../../../conponents/DataTable'

export default function BookmarksPage() {
    const params = {
        label: 'Bookmarks',
        field: 'bookmarkRepos',
    };

    return (
        <div className="bookmarks-page" >
            <DataTable {...params} />
        </div>
    )
}
