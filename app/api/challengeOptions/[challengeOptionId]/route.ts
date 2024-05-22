import { connectionToPG } from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

//get request
export const GET = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  
  const {db,client}= await connectionToPG();
  try{
    const adm = await isAdmin();
    if (!adm) {await  client.end();return new NextResponse("Unauthorized", { status: 401 });}
    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, params.challengeOptionId),
    });
    await  client.end();
    return NextResponse.json(data);
  }
  finally{
    await client.end();
  }

};

//put request
export const PUT = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  const {db,client}= await connectionToPG();
  try{
    const adm = await isAdmin();
  if (!adm) {await  client.end();return new NextResponse("Unauthorized", { status: 401 });}

  const body = await req.json();
  const data = await db
    .update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, params.challengeOptionId))
    .returning();
    await  client.end()
  return NextResponse.json(data[0]);
  }
  finally{
    await client.end()
  }
};

//delete request
export const DELETE = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  const {db,client}= await connectionToPG();
  try{
    const adm = await isAdmin();
    if (!adm) {await  client.end();return new NextResponse("Unauthorized", { status: 401 });}
    const data = await db
      .delete(challengeOptions)
      .where(eq(challengeOptions.id, params.challengeOptionId))
      .returning();
  
    return NextResponse.json(data[0]);
  }
  finally{
    await client.end()
  }
 
};
