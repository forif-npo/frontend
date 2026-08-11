export interface TeamMember {
  id: number;
  user_id: number;
  user_name: string;
  phone_num: string;
  act_year: number;
  act_semester: number;
  user_title: string | null;
  club_department: string | null;
  intro_tag: string | null;
  self_intro: string | null;
  prof_img_url: string | null;
  graduate_year: number | null;
}
