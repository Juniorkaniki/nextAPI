import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   
        try {
        // ✅ On attend les params
        const { id: rawId } = await params;
        const id = Number(rawId);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // ✅ Optimisation : On peut supprimer directement. 
        // Si le todo n'existe pas, Drizzle ne renverra pas d'erreur, 
        // mais on peut vérifier si une ligne a été affectée.
        const deletedRows = await db.delete(todos)
          .where(eq(todos.id, id))
          .returning(); // .returning() permet de vérifier si quelque chose a été supprimé

        if (deletedRows.length === 0) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json(
          { message: "Todo deleted successfully", deleted: deletedRows[0] }, 
          { status: 200 }
        );
        
    } catch (err) {
        console.error("Erreur d'informaticien lors de la suppression :", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    }

    export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Toujours en Promise pour Next 15
) {
  try {
    const { text } = await req.json();
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // ✅ On fait DIRECTEMENT l'update. 
    // .returning() nous dira si le todo existait.
    const updatedRows = await db.update(todos)
      .set({ text })
      .where(eq(todos.id, id))
      .returning();

    // Si le tableau est vide, c'est que l'ID n'existait pas en base
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo updated successfully", todo: updatedRows[0] }, 
      { status: 200 }
    );

  } catch (err) {
    console.error("Erreur PATCH :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
    