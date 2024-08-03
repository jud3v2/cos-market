import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementScore, incrementBulletCoin, decrementLives, incrementGameSpeed } from '../store/gameSlice';
import { motion } from 'framer-motion';
import Loading from "../components/Loading.jsx";

const Game = () => {
    const dispatch = useDispatch();
    const { score, bulletCoins, lives, gameSpeed } = useSelector((state) => state.game);

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
            // Ajouter une nouvelle cible toutes les x secondes, ajusté par gameSpeed
            setTargets((prevTargets) => [
                ...prevTargets,
                { id: Date.now(), type: getRandomTargetType() },
            ]);
        }, 2000 / gameSpeed);

        return () => clearInterval(interval);
    }, [gameSpeed]);

    useEffect(() => {
        const dailyInterval = setInterval(() => {
            dispatch(incrementGameSpeed());
        }, 86400000); // 24 heures en millisecondes

        return () => clearInterval(dailyInterval);
    }, [dispatch]);


    const handleTargetClick = (target) => {
        if (target.type === 'golden') {
            dispatch(incrementBulletCoin(1));
        } else if (target.type === 'red') {
            dispatch(decrementLives());
        } else {
            dispatch(incrementScore(10));
        }
        setTargets(targets.filter((t) => t.id !== target.id));
    };

    const getRandomTargetType = () => {
        const rand = Math.random();
        if (rand < 0.1) return 'golden';
        if (rand < 0.2) return 'red';
        return 'normal';
    };

    if(loading) return <Loading />;

    return (
        <div className="game">
            <div className="scoreboard">
                <p>Score: {score}</p>
                <p>Bullet Coins: {bulletCoins}</p>
                <p>Lives: {lives}</p>
            </div>
            <div className="targets">
                {targets.map((target) => (
                    <motion.div
                        key={target.id}
                        className={`target ${target.type}`}
                        onClick={() => handleTargetClick(target)}
                        animate={{ x: Math.random() * 90 + '%', y: Math.random() * 90 + '%' }}
                        transition={{ duration: 2 }}
                    >
                        {target.type === 'golden' ? '⭐' : target.type === 'red' ? '💥' : '🎯'}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Game;
