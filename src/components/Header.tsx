'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header({session}: {session:Session|null}) {
    return(
        <header className="border-b p-4 flex items-center justify-between">
            <Link 
                className="text-blue-600 font-bold text-2xl"
                href="/">
                    SIDEQUE$T
            </Link>
            <nav className="flex gap-4 *:rounded ">
                <Link href="/new" className="border border-blue-600 text-blue-600 inline-flex gap-1 items-center px-2 mr-4">
                    <FontAwesomeIcon icon={faPlus} className="h-4"/>
                    <span>Post a task</span>
                </Link>
                <span className="border-r"></span>
                {!session?.user && (
                    <>
                        <button className="border-0 text-gray-600">Sign up</button>
                        <button 
                            onClick={()=>signIn('google')}
                            className="bg-blue-600 text-white border-0 px-6">
                            Login
                        </button>
                    </>
                )}
               {session?.user && (
                <>
                    <Link href={'/account'}>
                        <Image 
                            className="rounded-md"
                            src={session.user.image as string} alt={'avatar'} width={36} height={36}/>
                    </Link>
                </>
               )}
            </nav>
        </header>
    );
}