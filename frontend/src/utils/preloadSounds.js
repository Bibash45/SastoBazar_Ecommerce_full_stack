import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { playSound } from "../slices/soundSlice"; 

const SoundPreloader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Preload sounds
    const preloadSounds = () => {
      const sounds = ["mouseClick"]; // Add more sound keys if necessary

      sounds.forEach((sound) => {
        const audio = new Audio(`/audio/${sound}.mp3`); // Adjust path according to your file structure
        audio.load();
      });
    };

    preloadSounds();

    // Optional: Play a sound to verify it works
    const testSound = () => {
      dispatch(playSound("mouseClick")); // Play test sound
    };

    testSound(); // Play the sound when the component mounts

  }, [dispatch]);

  return null; // This component does not render anything
};

export default SoundPreloader;
