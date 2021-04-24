import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import 'rc-slider/assets/index.css'

import styles from './styles.module.scss';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShufling,
        togglePlaying,
        toggleLooping,
        toggleShufling,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState,
        hasNext,
        hasPrevious } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];
    const [progress, setProgress] = useState(0);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });

    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else clearPlayerState();
    }



    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else audioRef.current.pause();
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )

            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(isPlaying ? Number(progress) : 0)}</span>
                    <div className={styles.slider}>
                        {
                            episode ? (
                                <Slider
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04d361' }}
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )
                        }

                    </div>
                    <span>{convertDurationToTimeString(Number(episode?.duration ?? 0))}</span>
                </div>

                {episode &&
                    < audio
                        src={episode.url}
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                    />
                }

                <div className={styles.buttons}>
                    <button type="button" className={isShufling ? styles.isActive : ''} disabled={!episode || episodeList.length == 1} onClick={toggleShufling}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    {isPlaying ? (
                        <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlaying}>
                            <img src="/pause.svg" alt="Pauser" />
                        </button>
                    ) : (
                        <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlaying}>
                            <img src="/play.svg" alt="Tocar" />
                        </button>
                    )}

                    <button type="button" disabled={!episode || !hasNext || episodeList.length == 1} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    <button type="button" className={isLooping ? styles.isActive : ''} disabled={!episode} onClick={toggleLooping} >
                        <img src="/repeat.svg" alt="Tocar anterior" />
                    </button>
                </div>
            </footer>
        </div>
    );
}