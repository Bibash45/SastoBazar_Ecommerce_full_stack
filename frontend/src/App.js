import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import SoundPreloader from "./utils/preloadSounds";
import { useDispatch } from "react-redux";
import { playSound } from "./slices/soundSlice";

const App = () => {
  const dispatch = useDispatch();

  // Function to play background sound
  const handlePlayBackgroundSound = () => {
    dispatch(playSound("backgroundSound")); // Dispatch playSound action
  };

  useEffect(() => {
    // Function to handle user interaction (click event)
    const handleUserInteraction = () => {
      handlePlayBackgroundSound(); // Play sound on user interaction
      document.removeEventListener("click", handleUserInteraction); // Remove listener after first use
    };

    // Add click event listener to document
    document.addEventListener("click", handleUserInteraction);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [dispatch]);

  return (
    <>
      <SoundPreloader />
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
