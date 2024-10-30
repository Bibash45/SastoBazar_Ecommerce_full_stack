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
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Stop sound when the tab is minimized or hidden
        dispatch(stopSound("backgroundSound"));
      } else {
        // Play sound when the tab is visible again (if desired)
        dispatch(playSound("backgroundSound"));
      }
    };

    // Attach the event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to remove the event listener
    return () => {
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
