import "next-auth";
declare module "next-auth" {
  interface User {
    phoneNum?: string;
    department?: string;
    imgUrl?: string | null;
    access_token?: string;
    backendRefreshToken?: string;
    role?: string;
    affiliation?: string | null;
  }

  interface Session {
    access_token: string;
    refreshToken?: string;
    forceRefresh?: boolean;
    role?: string;
    error?: string;
    user: User & {
      id: string;
      name: string;
      email: string;
      phoneNum: string;
      department: string;
      imgUrl: string | null;
      role: "MENTOR" | "ADMIN";
      affiliation: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendJwt?: string;
    backendRefreshToken?: string;
    role?: string;
    staffId?: string;
    staffName?: string;
    staffEmail?: string;
    staffPhoneNum?: string;
    staffDepartment?: string;
    staffImgUrl?: string | null;
    staffAffiliation?: string | null;
    error?: string;
  }
}
