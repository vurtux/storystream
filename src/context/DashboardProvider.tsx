'use client';

import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';

interface DetailProps {
    conId: number;
    bkName: string;
    conName: string;
    imgIrl: string;
}

interface ContentProps {
    conId: number;
    conName: string;
    imgIrl: string;
    cotDeepLink: string;
    artist_name: string;
    is_billable: number;
    ptype: string;
};

export interface DashboardContextType {
    openPlayButton: boolean;
    setOpenPlayButton: Dispatch<SetStateAction<boolean>>;
    subScriptionButton: string;
    setSubScriptionButton: Dispatch<SetStateAction<string>>;
    episodeId: number;
    setEpisodeId: Dispatch<SetStateAction<number>>;
    detailData: DetailProps;
    setDetailData: Dispatch<SetStateAction<DetailProps>>;
    seeAllData: ContentProps[];
    setSeeAllData: Dispatch<SetStateAction<ContentProps[]>>;
}

const defaultDetailData: DetailProps = {
    conId: 0,
    bkName: '',
    conName: '',
    imgIrl: '',
};

const DashboardContext = createContext<DashboardContextType>({
    openPlayButton: false,
    setOpenPlayButton: () => { },
    subScriptionButton: '',
    setSubScriptionButton: () => { },
    episodeId: 0,
    setEpisodeId: () => { },
    detailData: defaultDetailData,
    setDetailData: () => { },
    seeAllData: [{
        conId: 0,
        conName: "",
        imgIrl: "",
        cotDeepLink: "",
        artist_name: "",
        is_billable: 0,
        ptype: ""
    }],
    setSeeAllData: () => { },
});

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
    const [openPlayButton, setOpenPlayButton] = useState<boolean>(false);
    const [subScriptionButton, setSubScriptionButton] = useState<string>('');
    const [episodeId, setEpisodeId] = useState<number>(0);
    const [detailData, setDetailData] = useState<DetailProps>(defaultDetailData);
    const [seeAllData, setSeeAllData] = useState<ContentProps[]>([{
        conId: 0,
        conName: "",
        imgIrl: "",
        cotDeepLink: "",
        artist_name: "",
        is_billable: 0,
        ptype: ""
    }]);

    return (
        <DashboardContext.Provider
            value={{
                openPlayButton,
                setOpenPlayButton,
                subScriptionButton,
                setSubScriptionButton,
                episodeId,
                setEpisodeId,
                detailData,
                setDetailData,
                seeAllData,
                setSeeAllData
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default DashboardContext;
