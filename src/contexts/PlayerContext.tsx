import { createContext, useState, ReactNode, useContext } from 'react';


type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    clearPlayerState: () => void;
    isPlaying: boolean;
    isLooping: boolean;
    isShufling: boolean;
    togglePlaying: () => void;
    toggleLooping: () => void;
    toggleShufling: () => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
};

type PlayerContextProviderProps = {
    children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShufling, setIsShufling] = useState(false);

    const hasPrevious = (currentEpisodeIndex + 1) < episodeList.length;
    const hasNext = isShufling || currentEpisodeIndex > 0;


    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0);

    }

    function togglePlaying() {
        setIsPlaying(!isPlaying);
    }

    function toggleLooping() {
        setIsLooping(!isLooping)
    }

    function toggleShufling() {
        setIsShufling(!isShufling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function shuffle() {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }
    function playPrevious() {
        const previousEpisodeIndex = currentEpisodeIndex + 1;

        if (!hasPrevious) {
            return;
        } else if (isShufling) {
            shuffle();
        } else setCurrentEpisodeIndex(previousEpisodeIndex);

    }

    function playNext() {
        const nextEpisodeIndex = currentEpisodeIndex - 1;

        if (!hasNext) {
            return;
        } else if (isShufling) {
            shuffle();

        } else setCurrentEpisodeIndex(nextEpisodeIndex);

    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            clearPlayerState,
            isPlaying,
            isLooping,
            isShufling,
            togglePlaying,
            toggleLooping,
            toggleShufling,
            setPlayingState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}