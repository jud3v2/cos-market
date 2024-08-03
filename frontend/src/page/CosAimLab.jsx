import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementScore, incrementBulletCoin, decrementLives, incrementGameSpeed } from '../store/gameSlice';
import { motion } from 'framer-motion';
import Loading from "../components/Loading.jsx";

const Game = () => {
    const dispatch = useDispatch();
    const { score, bulletCoin, lives, gameSpeed } = useSelector((state) => state.game);

    const [targets, setTargets] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = localStorage.getItem('attempts');
        return savedAttempts ? JSON.parse(savedAttempts) : 3;
    });

    useEffect(() => {
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }, [attempts]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user);
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTargets((prevTargets) => [
                ...prevTargets,
                { id: Date.now(), type: getRandomTargetType(), x: Math.random() * 90, y: Math.random() * 90 },
            ]);
        }, 1500 / gameSpeed);

        return () => clearInterval(interval);
    }, [gameSpeed]);

    useEffect(() => {
        const dailyInterval = setInterval(() => {
            dispatch(incrementGameSpeed());
        }, 15 * 1000); // 30 * 1000 = 30 seconds

        return () => clearInterval(dailyInterval);
    }, [dispatch]);

    const handleTargetClick = (target) => {
        if (target.type === 'golden') {
            dispatch(incrementBulletCoin(1));
        } else if (target.type === 'red' || target.type === 'orange') {
            dispatch(decrementLives());
        } else {
            dispatch(incrementScore(10));
        }
        setTargets(targets.filter((t) => t.id !== target.id));
    };

    const getRandomTargetType = () => {
        const rand = Math.random();
        if (rand < 0.1) return 'golden';
        if (rand < 0.2) return 'orange';
        if (rand < 0.3) return 'red';
        return 'normal';
    };

    if (loading) return <Loading />;

    if(lives === 0) {
        return (
            <div className="game">
                <div className="scoreboard">
                    <p>Score: {score}</p>
                    <p>Bullet Coins: {bulletCoin}</p>
                    <p>Lives: {lives}</p>
                </div>
                <div className="game-over">
                    <p>Game Over</p>
                    <p>Score: {score}</p>
                    <p>Bullet Coins: {bulletCoin}</p>
                    <p>Attempts Left: {attempts}</p>
                    <button onClick={() => window.location.reload()}>Play Again</button>
                    {attempts > 0 && (
                        <button onClick={() => window.location.reload()}>Claim my Bullet Coin(s)</button>
                        )
                    }
                </div>
            </div>
        );
    }

    console.log(gameSpeed, bulletCoin, score, lives)

    return (
        <div className="game">
            <div className="scoreboard">
                <p>Score: {score}</p>
                <p>Bullet Coins: {bulletCoin}</p>
                <p>Lives: {lives}</p>
            </div>
            <div className="targets">
                {targets.map((target) => (
                    <motion.div
                        key={target.id}
                        className={`target ${target.type}`}
                        onClick={() => handleTargetClick(target)}
                        style={{ top: `${target.y}%`, left: `${target.x}%` }}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 5 / gameSpeed }}
                        onAnimationComplete={() => setTargets(targets.filter((t) => t.id !== target.id))}
                    />
                ))}
            </div>
        </div>
    );
};

export default Game;
