import {Route, Routes} from 'react-router-dom';
import SpecialAuction from './pages/SpecialAuction';
import Layout from './pages/Layout';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='specialAuction' element={<SpecialAuction/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
