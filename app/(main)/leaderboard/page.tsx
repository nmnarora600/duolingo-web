import FeedWrapper from "@/components/FeedWrapper";
import StickyWrapper from "@/components/StickyWrapper";
import UserProgress from "@/components/UserProgress";
import Promo from "@/components/promo";
import Quests from "@/components/quests";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  getTopUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function LeaderboardPage({}: Props) {
  const UserProgressData = await getUserProgress();
  const userSubscription = await getUserSubscription();
  const topUsers = await getTopUsers();
  if(!topUsers) redirect('/learn');
  if (!UserProgressData || !UserProgressData.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourses={UserProgressData.activeCourse}
          hearts={UserProgressData.hearts}
          points={UserProgressData.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={UserProgressData.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src={"/images/leaderboard.svg"}
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            LeaderBoard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {topUsers.map((userProgress, index) => (
            <div
              key={userProgress.userId}
              className="flex items-center p-2 rounded-xl w-full hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>

              <Avatar className="border bg-owl h-12 w-12 ml-3 mr-6">
                <AvatarImage
                  className="object-cover"
                  src={userProgress.userImageSrc}
                />
              </Avatar>

              <p className="font-bold text-neutral-400 flex-1">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
}
