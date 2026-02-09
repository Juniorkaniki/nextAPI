import { patchFetch } from "next/dist/server/app-render/entry-base"
import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { todos } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(){

    try {
        const data = await db.select().from(todos);
        return NextResponse.json(data, {status:200});
    }catch(error){
        console.error("Error fetching data:", error);
        return NextResponse.json({message: "save Error"}, {status: 500});
    }
}
Create = Post
Read = GET
Update = PATCH 
DELETE = DELETE