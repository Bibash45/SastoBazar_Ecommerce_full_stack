// src/features/navigation/soundSlice.js
import { createSlice } from "@reduxjs/toolkit";
import mouseClick from "../assets/audio/nav.mp3";
import loginSound from "../assets/audio/welcome.m4a";
import backgroundSound from "../assets/audio/sushant.mp3";

const mouseClickSound = new Audio(mouseClick);
const loginSoundAudio = new Audio(loginSound);
const backgroundSoundAudio = new Audio(backgroundSound);

// Set the volume for the background sound only
backgroundSoundAudio.volume = 0.1;  
mouseClickSound.volume = 0.3;

// Initial state
const initialState = {
  activeLink: "",
  sounds: {
    mouseSound: mouseClickSound,
    loginSound: loginSoundAudio,
    backgroundSound: backgroundSoundAudio,
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
        sound
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
    },
  },
});

export const { setActiveLink, playSound } = soundSlice.actions;
export default soundSlice.reducer;
