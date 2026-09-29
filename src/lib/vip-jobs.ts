type JobAudience = "공인중개사" | "분양상담사";
export interface JobItem { id: string; audience: JobAudience; title: string; region: string; pay: string; image: string; due: string; }

export const VIP_JOBS: JobItem[] = [
  { id: "hot-sales", audience: "분양상담사", title: "힐스빌리지 수지구청역\n분양팀 첫 조직", region: "경기남부", pay: "팀 RT 600만원", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&h=1400&fit=crop", due: "NOW" },
  { id: "hot-agent", audience: "공인중개사", title: "마포 대단지 전담\n공인중개사", region: "서울", pay: "기본급 280만 + 성과급", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1600&fit=crop", due: "D−5" },
  { id: "hot-songdo", audience: "분양상담사", title: "송도 센트럴파크\n오피스텔 팀원", region: "인천", pay: "팀원 RT 720만원", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1000&h=1400&fit=crop", due: "D−3" },
];
