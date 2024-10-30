import { createSlice } from "@reduxjs/toolkit";
import mouseClick from "../assets/audio/nav.mp3";
import loginSound from "../assets/audio/welcome.m4a";
import backgroundSound from "../assets/audio/sushant.mp3";
import cardSound from "../assets/audio/card.mp3";

const mouseClickSound = new Audio(mouseClick);
const loginSoundAudio = new Audio(loginSound);
const backgroundSoundAudio = new Audio(backgroundSound);
const cardSoundAudio = new Audio(cardSound);

backgroundSoundAudio.volume = 0.1;  
mouseClickSound.volume = 0.3;
cardSoundAudio.volume = 0.3;

// Initial state
const initialState = {
  activeLink: "",
  sounds: {
    mouseSound: mouseClickSound,
    loginSound: loginSoundAudio,
    backgroundSound: backgroundSoundAudio,
    cardSound: cardSoundAudio,
  },
  isBackgroundPlaying: false,  // Track if background sound is playing
};

const soundSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveLink: (state, action) => {
      state.activeLink = action.payload;
    },
    playSound: (state, action) => {
      const sound = state.sounds[action.payload];
      if (sound) {
        if (action.payload === "backgroundSound" && state.isBackgroundPlaying) {
          // Don't play if background sound is already playing
          return;
        }

        sound.currentTime = 0; // Reset to start
        sound.play().catch((error) => console.error("Error playing sound:", error));

        // Update state if background sound is played
        if (action.payload === "backgroundSound") {
          state.isBackgroundPlaying = true;
          sound.loop = true; // Loop background sound
        }
      }
    },
    stopSound: (state, action) => {
      const sound = state.sounds[action.payload];
      if (sound) {
        sound.pause(); 
        if (action.payload === "backgroundSound") {
          state.isBackgroundPlaying = false; // Reset state
        }
      }
    },
  },
});

export const { setActiveLink, playSound, stopSound } = soundSlice.actions; 
export default soundSlice.reducer;
