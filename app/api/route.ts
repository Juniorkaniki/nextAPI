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
        return NextResponse.json({message: "server Error"}, {status: 500});
    }
}


export async function POST(req: Request){

    try {
        const body = await req.json();
        const { text } = body;
        if(!text){
              return NextResponse.json({
                message: "text is required"}, 
                {status: 400});
                await db.insert(todos).values({text});  
                return NextResponse.json({message: "Todo created successfully"}, 
                    {status: 200});  
        } 
        
}
    catch(error){
        console.error("POST Error creating todo:", error);
        return NextResponse.json({message: "server Error"}, 
            {status: 500});
    }
}