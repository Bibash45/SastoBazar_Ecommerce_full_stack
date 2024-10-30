// src/features/navigation/soundSlice.js
import { createSlice } from "@reduxjs/toolkit";
import mouseClick from "../assets/audio/femaleghost.mp3"; 
import loginSound from "../assets/audio/welcome.m4a"; 

const mouseClickSound = new Audio(mouseClick);
const loginSoundAudio = new Audio(loginSound); // Create an audio instance for the login sound

// Initial state
const initialState = {
  activeLink: "",
  sounds: {
    mouseSound: mouseClickSound,
    loginSound: loginSoundAudio, // Add the login sound here
    // Add other sounds here if needed
  },
};

const soundSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveLink: (state, action) => {
      state.activeLink = action.payload;
    },
    // Play specified sound
    playSound: (state, action) => {
      const sound = state.sounds[action.payload];
      if (sound) {
        // Reset to start
        sound.currentTime = 0; 
        sound.play().catch((error) => console.error("Error playing sound:", error));
      }
    },
  },
});

export const { setActiveLink, playSound } = soundSlice.actions;
export default soundSlice.reducer; 
