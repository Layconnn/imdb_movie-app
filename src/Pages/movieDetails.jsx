import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Api from "../Endpoints/api";
import "../Styles/MovieCard.scss";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { movie_id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsClicked(storedFavorites.includes(movie_id));
  }, [movie_id]);

  const handleClick = () => {
    const mediaType = "movie";
    const mediaId = movie_id;
    const favorite = !isClicked;

    Api.post(`/account/20428005/favorite`, {
      media_type: mediaType,
      media_id: mediaId,
      favorite: favorite,
    })
      .then((response) => {
        setIsClicked(favorite);
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorite) {
          toast.success("Added to favourites!📍");
          localStorage.setItem(
            "favorites",
            JSON.stringify([...storedFavorites, movie_id])
          );
        } else {
          const updatedFavorites = storedFavorites.filter(
            (id) => id !== movie_id
          );
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          toast.error("Removed from favorites!");
        }
      })
      .catch((error) => {
        toast.error("Unable to add to favorites");
        console.error("Error adding to favorites:", error);
      });
  };

  const router = useNavigate();

  useEffect(() => {
    Api.get(`/movie/${movie_id}`)
      .then((res) => {
        setMovieDetails(res.data);
        if (res.data === null) {
          toast.error("Invalid movie ID");
          router("/");
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Unable to load Movie Details");
          router("/");
        }
        console.error(err);
      });
  }, [movie_id]);

  return (
    <div>
      {movieDetails ? (
        <div data-testid="movie-card" className="whole">
          {movieDetails.poster_path && (
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w185${movieDetails.poster_path}`}
                alt={movieDetails.title}
                className="pic"
                data-testid="movie-poster"
              />
              <i
                className={`fa fa-heart icon ${isHovered ? "hovered" : ""} ${
                  isClicked ? "clicked" : ""
                } `}
                alt="add movie to favorites"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              ></i>
              {isHovered && (
                <span className="tooltip">
                  {isClicked ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              )}
            </div>
          )}
          <h2 data-testid="movie-title" className="title">
            {movieDetails.title}
          </h2>
          <p className="date">
            <i data-testid="movie-release-date">
              {movieDetails.release_date}
            </i>
          </p>
          <p data-testid="movie-runtime" className="date">
            {movieDetails.runtime} minutes
          </p>
          <p data-testid="movie-overview" className="overviews">
            {movieDetails.overview}
          </p>
        </div>
      ) : (
        <div className="loading"></div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MovieDetails;
