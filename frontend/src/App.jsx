import React from 'react'
import NavigationBar from './conponents/NavigationBar'
import { useRoutes } from 'react-router-dom'
import routes from './routes/routes';
import './App.scss';

function App() {
  const element = useRoutes(routes);
  return (
    <div className='app'>
      <NavigationBar />
      <div className="content">
        {element}
      </div>
    </div>
  );
}

export default App;
