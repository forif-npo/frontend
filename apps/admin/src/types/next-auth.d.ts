import "next-auth";
declare module "next-auth" {
  interface User {
    phoneNum?: string;
    department?: string;
    imgUrl?: string | null;
    access_token?: string;
    role?: string;
  }

  interface Session {
    access_token: string;
    role?: string;
    user: User & {
      id: string;
      name: string;
      email: string;
      phoneNum: string;
      department: string;
      imgUrl: string | null;
      role: "MENTOR" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendJwt?: string;
    role?: string;
    staffId?: string;
    staffName?: string;
    staffEmail?: string;
    staffPhoneNum?: string;
    staffDepartment?: string;
    staffImgUrl?: string | null;
  }
}
