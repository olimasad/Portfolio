import { notFound } from "next/navigation";
import DetailView from "../../../components/detail-view";
import { achievements, projects } from "../../../lib/data";
import {
  detailIdForAchievement,
  getHomeDetail,
  listHomeDetailIds,
} from "../../../lib/home-details";

function backForDetailId(id) {
  if (id.startsWith("project-") || id.startsWith("achievement-lab-01")) {
    return { href: "/projects", label: "Back to Projects" };
  }
  if (
    id.startsWith("award-") ||
    id.startsWith("achievement-") ||
    id.startsWith("volunteer-shine")
  ) {
    return { href: "/achievements", label: "Back to Achievements" };
  }
  return { href: "/", label: "Back to Home" };
}

export function generateStaticParams() {
  const ids = new Set(listHomeDetailIds());

  for (const project of projects) {
    if (project.detailId) ids.add(project.detailId);
  }

  for (const achievement of achievements) {
    ids.add(detailIdForAchievement(achievement.slug));
    ids.add(`achievement-${achievement.slug}`);
  }

  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const detail = getHomeDetail(id);
  return {
    title: detail ? `${detail.title} - Oliver Massaad` : "Detail - Oliver Massaad",
  };
}

export default async function DetailPage({ params }) {
  const { id } = await params;
  const detail = getHomeDetail(id);

  if (!detail) {
    notFound();
  }

  const back = backForDetailId(id);

  return <DetailView detail={detail} backHref={back.href} backLabel={back.label} />;
}
