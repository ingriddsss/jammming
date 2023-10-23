import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import Spotify from './components/Spotify';
import { useEffect } from 'react'; 

function App() {
  useEffect(() => {
    document.title = "Jammming"; // Set the new tab name
  }, []);

  // Get the access token
  const accessToken = Spotify.getAccessToken();

  return (
    <div className="App">
      <Header accessToken={accessToken} />
      <hr />
      <Search accessToken={accessToken} />
      {/* <hr /> */}
      {/* <HandleTrack accessToken={accessToken} /> */}
    </div>
  );
}

export default App;
