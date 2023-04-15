import React, {useEffect, useState} from 'react'
import NavigationBar from './conponents/NavigationBar'
import { useRoutes, useLocation, useNavigate} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import routes from './routes/routes';
import './App.scss';

function App() {
  const element = useRoutes(routes);
  const path = useLocation().pathname;
  const navigate = useNavigate()
  const [token, setToken] = useState(undefined);

  useEffect(() => {
      setToken(localStorage.getItem('token')) 
      if (!token) navigate('/login');
  }, [path])

  return (
    <div className='app'>
      {path !== '/login' ? <NavigationBar /> : ''}
      <div className="content">
        {token ? element : <LoginPage />}
      </div>
    </div>
  );
}

export default App;
