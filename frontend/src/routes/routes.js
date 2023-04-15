import { Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ExplorePage from '../pages/ExplorePage'
import UserCenterPage from '../pages/UserCenterPage'
import BookmarksPage from '../pages/UserCenterPage/BookmarksPage'
import MyStarredPage from '../pages/UserCenterPage/MyStarredPage'
import MyReposPage from '../pages/UserCenterPage/MyReposPage'
import HistoryPage from '../pages/UserCenterPage/HistoryPage'
import AnalyzePage from '../pages/AnalyzePage'
import LoginPage from '../pages/LoginPage'

const routes = [
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/index',
        element: <HomePage />
    },
    {
        path: '/analyze/:user/:repo',
        element: <AnalyzePage />
    },
    {
        path: '/explore',
        element: <ExplorePage />
    },
    {
        path: '/usercenter',
        element: <UserCenterPage />,
        children: [
            {
                path: 'bookmarks',
                element: <BookmarksPage />
            },
            {
                path: 'mystarred',
                element: <MyStarredPage />
            },
            {
                path: 'myrepos',
                element: <MyReposPage />
            },
            {
                path: 'history',
                element: <HistoryPage />
            },
            {
                path: '',
                element: <Navigate to="bookmarks" />
            }
        ]
    },
    {
        path: '/',
        element: <Navigate to="/index" />
    }
]
export default routes;