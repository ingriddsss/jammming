import { useState } from 'react';
import Spotify from './Spotify';
import SpotifyWebApi from "spotify-web-api-js";

export default function Search({ accessToken }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState("");

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);

    // Function to save the playlist to the user's Spotify account
    const savePlaylist = async () => {
        if (playlistName.trim() === "") {
            console.error("Playlist name cannot be empty");
            return;
        }
        try {
            
            // Get the user's ID
            const user = await spotifyApi.getMe();
            const userId = user.id;

            // Create a new playlist
            const playlist = await spotifyApi.createPlaylist(userId, {
                name: playlistName,
                description: "banger playlist",
            });
            const playlistId = playlist.id;

            // Add tracks to the playlist
            const trackUris = playlistTracks.map((track) => track.uri);
            await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

            // Reset the playlist on the web app
            setPlaylistTracks([]);
        } catch (error) {
            console.error("Error saving playlist:", error);
        }
    };

    const handleSearch = async () => {
        try {
          const response = await Spotify.search(searchQuery, accessToken);
          // Process the response data
          setSearchResults(response.tracks.items);
        } catch (error) {
          console.log(error);
        }
    };

    const handleKeyPress = (e) => {
        if(e.key === "Enter") {
            handleSearch();
            setSearchQuery('');
        }
    }

    const handleAddTrack = (track) => {
        // Add specific track to playlistTracks
        setPlaylistTracks((prevPlaylist) => [...prevPlaylist, track]);
    };

    const handleRemoveTrack = (trackId) => {
        setPlaylistTracks((prevPlaylist) => prevPlaylist.filter(track => track.id !== trackId))
    }


    return(
        <section className="search">
            <input 
                type="text" 
                placeholder="Search a jam"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleSearch}>Search</button>
            <hr />
            <div className="main-container">
                <section className="track-container">
                    <h3>Search Results</h3>
                    {
                        searchResults.map((track) => (
                            <div key={track.id} className="track">
                                <div className="track-details">
                                    <h3>{track.name}</h3>
                                    <p>{`${track.artists[0].name} | ${track.album.name}`}</p>
                                </div>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    height="1em" 
                                    viewBox="0 0 448 512"
                                    onClick={() => handleAddTrack(track)}
                                >
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                </svg>
                            </div>
                        ))
                    }
                </section>
                <section className="playlist track-container">
                    <h3>Playlist</h3>
                    <input 
                        type="text" 
                        placeholder="Name your playlist"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    {
                        playlistTracks.map((track) => (
                            <div key={track.id} className="track">
                                <div className="track-details">
                                    <h3>{track.name}</h3>
                                    <p>{`${track.artists[0].name} | ${track.album.name}`}</p>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 448 512"
                                    onClick={() => handleRemoveTrack(track.id)}
                                >
                                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                </svg>
                            </div>
                    ))}
                    <button
                        className='save'
                        onClick={savePlaylist}
                    >
                        Save to Spotify
                    </button>
                </section>
            </div>
        </section>
    );
}