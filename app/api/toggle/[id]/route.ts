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
}