import './App.css';
import Form from './components/Form/Form';

function App() {
  return (
    <div className='page'>
      <div className='nav-bar'>
        <img src={process.env.PUBLIC_URL + '/assets/b2b.png'} alt="vts" className="nav-logo"/>
        <ul className="nav-links">
          <li className="nav link">Link-1</li>
          <li className="nav link">Link-2</li>
          {/* <li className="nav link">Link-3</li>
          <li className="nav link">Link-4</li> */}
        </ul>
      </div>
      <Form/>
    </div>
  );
}

export default App;
