export interface Candidate {
  _id: string;
  name: string;
  rollNo: string;
  branch: string;
  year: string;
  phone: string;
  email: string;
  society: string;
  whyJoin: string;
  softSkills: string[];
  hardSkills: string[];
  projectLink: string;
  imageUrl: string;
  githubProfile: string;
  residence: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CandidateScore {
  technicalSkills: number;
  communication: number;
  leadershipPotential: number;
  overallRating: number;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface FilterOptions {
  search: string;
  branch: string;
  year: string;
  society: string;
}
