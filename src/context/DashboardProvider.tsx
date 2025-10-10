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
    showSubscriptionDialog: boolean,
    setShowSubscriptionDialog:  Dispatch<SetStateAction<boolean>>,
    timer: number,
    setTimer:  Dispatch<SetStateAction<number>>,
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
    showSubscriptionDialog: false,
    setShowSubscriptionDialog: () => { },
    timer: 5,
    setTimer: () => { },
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
    const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
    const [timer, setTimer] = useState(5);

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
                showSubscriptionDialog,
                setShowSubscriptionDialog,
                seeAllData,
                setSeeAllData,
                timer,
                setTimer
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default DashboardContext;
