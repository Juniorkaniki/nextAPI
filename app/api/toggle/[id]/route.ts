import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq, sql } from "drizzle-orm"; // Ajout de 'sql' pour l'astuce

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Indispensable en Next.js 15
) {
  try {
    // 1. On récupère l'ID de manière asynchrone
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // 2. L'astuce d'informaticien : On inverse le booléen directement en SQL
    // Cela évite de faire un "select" avant.
    const updatedRows = await db
      .update(todos)
      .set({ 
        done: sql`NOT ${todos.done}` // ✅ Inverse la valeur actuelle (true -> false, false -> true)
      })
      .where(eq(todos.id, id))
      .returning(); // ✅ On récupère le résultat pour vérifier si ça a marché

    // 3. Si rien n'a été retourné, c'est que l'ID n'existait pas
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: "Todo Updated", todo: updatedRows[0] }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur PATCH :", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
