import axios from "../../API/axios.js";
import React, { useEffect, useState } from "react";
import requests from "../../API/requests";
import "./Banner.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const Banner = () => {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        result.data.results[
          Math.floor(Math.random() * result.data.results.length - 1)
        ]
      );
      return result;
    }
    fetchData();
  }, []);

  const handlePlay = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        movieTrailer(movie.name || "")
          .then((url) => {
            try {
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get("v"));
            } catch (error) {
              alert("Cannot find trailer for this movie");
            }
          })
          .cacth((err) => {
            alert("Cannot find trailer for this movie");
          });
      } catch (error) {}
    }
  };

  return (
    <header
      onClick={() => setTrailerUrl("")}
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button onClick={() => handlePlay(movie)} className="banner__button">
            Play
          </button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom"></div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </header>
  );
};

export default Banner;
