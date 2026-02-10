import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
