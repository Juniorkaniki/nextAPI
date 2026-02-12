import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function PATCH(req:NextRequest,
    {params} : {params: { id :string}}
)  {
    const id =Number (params.id);
    if (isNaN(id)){
        return NextResponse.json({error : "Unvalid ID"},{status :400});
    }

    const currentID =await db.select().from(todos).where(eq(todos.id,id)).limit(1);

    const existingTodo =currentID[0];
    if(!existingTodo) {
        return NextResponse.json({error: "Todo not found"},{status: 404});
    }
    await db.update(todos).set({text}).where(eq(todos.id,id));
    
}