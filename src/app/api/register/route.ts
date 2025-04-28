import bcrypt from "bcrypt"; 

import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {

    const body = await request.json(); 
    const {
      email, 
      name, 
      password
    } = body; 
  
    if (!email || !name || !password) {
      return new NextResponse("Missing info", {status: 400}); 
    }
  
    const hashedPassword = await bcrypt.hash(password, 12); 

    // TODO: add a check for an existing email
    // const query = await prisma.user.findUnique({
    //   where: email
    // })
    // if (query) {

    // }
    
    const user = await prisma.user.create({
      data: {
        email, 
        name, 
        hashedPassword
      }
    })
  
    return NextResponse.json(user); // .json() does not required the new operator 
  } catch (error: any) {
    console.log(error, "Registration Error");
    return new NextResponse("Internal Error", {status: 500});
  }
}