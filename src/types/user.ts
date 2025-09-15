// types/user.ts

export interface UserInfo {
    userId: number;
    email: string;
    firstname: string;
    lastname: string;
    gender: string | null;
    isdCode: string;
    mobileNo: string;
    country: string;
    state: string;
    name: string;
    vip: number;
    showAds: number;
    isLoggedin: number;
    langCode: string;
    profileImgUrl: string | null;
    socialProfileUrl: string | null;
    isSilentLogin: number;
    mytest: string;
    payment_webview: string;
    tagsexisting: boolean;
}

export interface FollowList {
    artisteFollows: unknown[];  // Update with correct types if available
    genreFollows: unknown[];
}

export interface ProfileResponse {
    response: {
        status: boolean;
        code: string;
        msg: string;
        profile: UserInfo;
        followList: FollowList;
    };
}
