"use client";
import { redirect } from "next/navigation";

export default function WhiteHatRedirect() {
  redirect("/shop/porcelain-hat");
  return null;
}
   