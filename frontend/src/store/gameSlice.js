import { createSlice } from '@reduxjs/toolkit';

const initialState = {
        score: 0,
        bulletCoin: 0,
        lives: 3,
        gameSpeed: 1,
};

const gameSlice = createSlice({
        name: 'game',
        initialState,
        reducers: {
                incrementScore: (state, action) => {
                        state.score += action.payload;
                },
                incrementBulletCoin: (state, action) => {
                        state.bulletCoin += action.payload;
                },
                decrementLives: (state) => {
                        state.lives -= 1;
                },
                incrementGameSpeed: (state) => {
                        state.gameSpeed += 0.1;
                },
                resetGame: (state) => {
                        state.score = 0;
                        state.bulletCoin = 0;
                        state.lives = 3;
                        state.gameSpeed = 1;
                },

        },
});

export const { incrementScore, incrementBulletCoin, decrementLives, incrementGameSpeed, resetGame } = gameSlice.actions;
export default gameSlice.reducer;