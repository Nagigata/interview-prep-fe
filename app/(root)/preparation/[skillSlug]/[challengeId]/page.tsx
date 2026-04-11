import { getChallengeById } from "@/lib/actions/challenges.action";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ChallengeEditorView from "@/components/ChallengeEditorView";

interface Props {
  params: Promise<{ skillSlug: string; challengeId: string }>;
}

const ChallengeEditorPage = async ({ params }: Props) => {
  const { skillSlug, challengeId } = await params;
  
  // Fetch data on the server
  const challenge = await getChallengeById(challengeId);
  
  if (!challenge) {
    notFound();
  }

  // Get dictionary based on server cookies
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const dictionary = getDictionary(locale);

  return (
    <ChallengeEditorView 
      challenge={challenge}
      dictionary={dictionary}
      skillSlug={skillSlug}
    />
  );
};

export default ChallengeEditorPage;
