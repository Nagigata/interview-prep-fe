"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ChallengeCard from "./ChallengeCard";
import { Challenge } from "@/types";
import { getAllChallenges } from "@/lib/actions/challenges.action";
import { Loader2 } from "lucide-react";

interface Props {
  initialFilters: Record<string, string | string[]>;
  dictionary: any;
}

const LoadMoreChallenges = ({ initialFilters, dictionary }: Props) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreData();
    }
  }, [inView, hasMore, isLoading]);

  const loadMoreData = async () => {
    setIsLoading(true);
    try {
      const filtersWithPage = { ...initialFilters, page, limit: 100 };
      const response = await getAllChallenges(filtersWithPage);
      const nextChallenges = response?.data;

      if (nextChallenges && nextChallenges.length > 0) {
        setChallenges((prev) => {
          // Prevent duplicates incase of react strict mode
          const newItems = nextChallenges.filter(
            (nc) => !prev.some((pc) => pc.id === nc.id)
          );
          return [...prev, ...newItems];
        });
        setPage((prev) => prev + 1);
        if (nextChallenges.length < 100) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {challenges.map((challenge) => (
        <ChallengeCard
          key={`more-${challenge.id}`}
          challenge={challenge}
          skillSlug={(challenge as any).skillSlug || "algorithms"}
          dictionary={dictionary}
        />
      ))}
      {hasMore && (
        <div ref={ref} className="flex justify-center items-center py-6 w-full">
          <Loader2 className="animate-spin text-primary-200" size={32} />
        </div>
      )}
    </>
  );
};

export default LoadMoreChallenges;
