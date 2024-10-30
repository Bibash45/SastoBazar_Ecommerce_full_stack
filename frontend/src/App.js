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
import { playSound, stopSound } from "./slices/soundSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set a delay of 3 seconds to play the background sound
    const playSoundWithDelay = setTimeout(() => {
      dispatch(playSound("backgroundSound"));
    }, 3000); // 3000 milliseconds = 3 seconds

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        dispatch(stopSound("backgroundSound"));
      } else {
        dispatch(playSound("backgroundSound"));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(playSoundWithDelay); // Clear the timeout if the component unmounts
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
