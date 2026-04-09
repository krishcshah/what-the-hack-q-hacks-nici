"use server";

import { applyAdjustment } from "@/lib/data";
import type { CartCategory } from "@/lib/types";

export async function adjustCartAction(
  categories: CartCategory[],
  type: string
): Promise<CartCategory[]> {
  return applyAdjustment(categories, type);
}
