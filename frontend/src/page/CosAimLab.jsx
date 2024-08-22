import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementScore, incrementBulletCoin, decrementLives, incrementGameSpeed } from '../store/gameSlice';
import { motion } from 'framer-motion';
import Loading from "../components/Loading.jsx";
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

// Import target images
import cibleBleu from '../assets/aimlab/cible_bleu.png';
import cibleOrange from '../assets/aimlab/cible_orange.png';
import cibleJaune from '../assets/aimlab/cible_jaune.png';
import cibleRouge from '../assets/aimlab/cible_rouge.png';

// Import background images
import Mirage from '../assets/aimlab/mirage.png';
import Inferno from '../assets/aimlab/inferno.png';
import Dust from '../assets/aimlab/dust.png';

const Game = () => {
    const dispatch = useDispatch();
    const { score, bulletCoin, lives, gameSpeed } = useSelector((state) => state.game);

    const [targets, setTargets] = useState([]);
    const [user, setUser] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState(null);

    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = localStorage.getItem('attempts');
        return savedAttempts ? JSON.parse(savedAttempts) : 0;
    });

    const [dateResetAttempt, setDateResetAttempt] = useState(() => {
        const savedDateResetAttempt = localStorage.getItem('dateResetAttempt');
        return savedDateResetAttempt ? JSON.parse(savedDateResetAttempt) : new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    });

    const makeDeposit = async () => {
        const loading = toast.loading("Dépôt de vos bullet coins en cours...");
        setButtonLoading(true);
        try {
            const btDataResponse = await axios.post('/bulletcoin/', { user_id: user.id });
            const btData = btDataResponse.data;
            console.log('bulletcoin data fetched');

            const ctResponse = await axios.post('/transaction', {
                user_id: user.id,
                type: 'deposit',
                amount: bulletCoin <= 50 ? bulletCoin : 50,
            });
            const ct = ctResponse.data;
            console.log('transaction created');

            const bcId = btData.id;
            const transactionId = ct.transaction_id;

            await axios.put(`/bulletcoin/${bcId}`, {
                user_id: user.id,
                amount: bulletCoin <= 50 ? bulletCoin : 50,
                description: 'Deposit from game',
                status: "confirmed",
                transaction_id: transactionId,
                type: "deposit"
            })
                .then(() => {
                    console.log('deposit made');
                    toast.success("Vos bullet coins ont été déposés avec succès");
                    setTimeout(() => {
                        window.location.reload();
                        setButtonLoading(false);
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Une erreur est survenue lors de la récupération de vos bullet coins");
                })
                .finally(() => toast.dismiss(loading));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        localStorage.setItem('attempts', JSON.stringify(attempts));
    }, [attempts]);

    useEffect(() => {
        const t = localStorage.getItem('token') || null;
        if (t) {
            const token = jwtDecode(t);
            if (token) {
                setUser(token.user);
            }
        }  else {
            toast("Vous devez être connecté pour jouer", { type: "error" });
            setTimeout(() => {
                window.location.href = '/steam/login';
            }, 1500)
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
        }, 15 * 1000);

        return () => clearInterval(dailyInterval);
    }, [dispatch]);

    useEffect(() => {
        if (lives === 0 && attempts < 3) {
            setAttempts(attempts + 1);
            localStorage.setItem('dateResetAttempt', JSON.stringify(dateResetAttempt));
            localStorage.setItem('attempts', JSON.stringify(attempts));

            return () => {
                syncGame().then(r => console.log(r));
            }
        }
    }, [lives]);

    const handleTargetClick = (target) => {
        if (target.type === 'yellow') {
            dispatch(incrementBulletCoin(1));
        } else if (target.type === 'red' || target.type === 'orange') {
            dispatch(decrementLives());
        } else if (target.type === 'blue') {
            dispatch(incrementScore(10));
        }
        setTargets(targets.filter((t) => t.id !== target.id));
    };

    const getRandomTargetType = () => {
        const rand = Math.random();
        if (rand < 0.2) return 'yellow';  // 20% chance to spawn yellow target
        if (rand < 0.4) return 'orange';  // 20% chance to spawn orange target
        if (rand < 0.6) return 'red';     // 20% chance to spawn red target
        return 'blue';                    // 40% chance to spawn blue target (default)
    };

    const syncGame = async () => {
        const loading = toast.loading("Synchronisation du jeu en cours...");
        try {
            const response = await axios.post(`/sync/game/${user.id}`, {
                game_attempts: attempts,
                game_reset_attempts_date: String(dateResetAttempt),
            });
            const game = response.data;
            setAttempts(response.data.game_attempts);
            setDateResetAttempt(new Date(response.data.game_reset_attempts_date).getTime());
            console.log('game synced', game);
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de la synchronisation du jeu");
        } finally {
            toast.dismiss(loading);
        }
    }

    if (lives === 0) {
        return (
            <div className="game">
                <div className="game-over">
                    <h3 className={"my-5 text-lg"}>Game Over</h3>
                    <p>Score: {score}</p>
                    <p>Bullet Coins: {bulletCoin}</p>
                    <p>Essaie restant: {3 - attempts}</p>
                    <button className={"bg-yellow-500 hover:bg-yellow-700 text-white rounded p-2"} onClick={() => window.location.reload()}>Rejouer</button>
                    {bulletCoin > 0 && (
                        <button className={"bg-yellow-500 hover:bg-yellow-700 text-white rounded p-2"} onClick={async () => await makeDeposit()}>Récupérer mes bullet coins</button>
                    )}
                </div>
            </div>
        );
    }
    
    const checkIfUseCanPlay = async () => {
        const loading = toast.loading("Vérification de vos essais en cours...");
        try {
            const response = await axios.get(`/sync/game/check-if-user-can-play/${user.id}`)
                .then(res => {
                    console.log(res.data)
                    return res;
                })
            const game = response.data;
            console.log('game fetched', game);

            if (game.game_attempts >= 3) {
                setAttempts(game.game_attempts);
                setDateResetAttempt(game.game_reset_attempts_date);
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de la vérification de vos essais");
        } finally {
            toast.dismiss(loading);
        }
    }

    if (loading) return <Loading />;

    // Pre-game background selection screen
    if (!gameStarted) {
        return (
            <div className="game">
                <div className="scoreboard">
                    <p>Score: {score}</p>
                    <p>Bullet Coins: {bulletCoin}</p>
                    <p>Lives: {lives}</p>
                </div>
                <div className="game-start">
                    <h2>Choisissez votre map :</h2>
                    <div className="map-selection">
                        <button
                            className={`map-button ${selectedBackground === Mirage ? 'selected' : ''}`}
                            onClick={() => setSelectedBackground(Mirage)}
                        >
                            Mirage
                        </button>
                        <button
                            className={`map-button ${selectedBackground === Inferno ? 'selected' : ''}`}
                            onClick={() => setSelectedBackground(Inferno)}
                        >
                            Inferno
                        </button>
                        <button
                            className={`map-button ${selectedBackground === Dust ? 'selected' : ''}`}
                            onClick={() => setSelectedBackground(Dust)}
                        >
                            Dust
                        </button>
                    </div>
                    <button
                        className={"bg-yellow-500 hover:bg-yellow-700 text-white rounded p-2 my-5"}
                        disabled={buttonLoading || !selectedBackground}  // Disable if no map selected
                        onClick={async () => {
                            await syncGame();
                            await checkIfUseCanPlay();
                            setGameStarted(true);
                        }}
                    >
                        Commencer le jeu
                    </button>
                </div>
            </div>
        );
    }

    if (attempts >= 3) {
        const hours = Math.floor((dateResetAttempt - new Date().getTime()) / (60 * 60 * 1000));
        const minutes = Math.floor((dateResetAttempt - new Date().getTime()) / (60 * 1000) % 60);
        const seconds = Math.floor((dateResetAttempt - new Date().getTime()) / 1000 % 60);

        return (
            <div className="game">
                <div className="scoreboard">
                    <h3 className={"text-2xl my-5"}>Oops !</h3>
                </div>
                <div className="game-start">
                    <p>Vous avez utilisé tous vos essais du jour</p>
                    <p>Vous pourrez rejouer dans: {hours} heures {minutes} minutes {seconds} secondes</p>
                </div>
            </div>
        );
    }

    const getTargetImage = (type) => {
        switch (type) {
            case 'blue':
                return cibleBleu;
            case 'yellow':
                return cibleJaune;
            case 'orange':
                return cibleOrange;
            case 'red':
                return cibleRouge;
            default:
                return null;
        }
    };

    return (
        <div
            className="game"
            style={{
                backgroundImage: `url(${selectedBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100vw',
                position: 'relative'
            }}
        >
            {/* Scoreboard in top-right corner */}
            <div
                className="scoreboard"
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
            >
                <p>Score: {score}</p>
                <p>Bullet Coins: {bulletCoin}</p>
                <p>Vie restante(s): {lives}</p>
                <p>Vitesse du jeu x {gameSpeed.toPrecision(2)}</p>
            </div>
            <div className="targets" style={{ height: '100%', width: '100%' }}>
                {targets.map((target) => (
                    <motion.div
                        key={target.id}
                        className={`target ${target.type}`}
                        onClick={() => handleTargetClick(target)}
                        style={{
                            top: `${target.y}%`,
                            left: `${target.x}%`,
                            position: 'absolute',
                            backgroundImage: `url(${getTargetImage(target.type)})`,
                            backgroundSize: 'cover',
                            width: '50px',
                            height: '50px'
                        }}
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
