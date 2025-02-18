'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextLogo from './TextLogo'
import SearchBar from './SearchBar'

export default function Header ({ session }: { session: Session | null }) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const handleSearch = (formData: FormData) => {
    const searchPhrase = formData.get("phrase") as string;
    const searchCategory = formData.get("category") as string;
  
    console.log("Search Query:", searchPhrase);
    console.log("Selected Category:", searchCategory);
  
    //router.push('/filters.phrase')
    router.push(`?phrase=${encodeURIComponent(searchPhrase)}&category=${encodeURIComponent(searchCategory)}`);
  };

  return (
    <header className='border-b-2 border-theme-green p-4 flex items-center justify-between h-20'>
      <Link href='/'>
        <TextLogo/>
      </Link>

      <div className="flex-1 flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      <nav className=' items-center flex gap-4 *:rounded '>
      {session?.user && (
          <Link
            href='/new'
            className='border h-full border-theme-green text-theme-green inline-flex gap-1 items-center px-2 mr-4 py-2'
          >
            <FontAwesomeIcon icon={faPlus} className='h-4' />
            <span>Post a task</span>
          </Link>
        )}
        <span className='border-r'></span>
        {!session?.user && (
          <>
            {/* 
              <Link href="/new-profile" className='h-full border border-theme-black text-theme-black inline-flex gap-1 items-center px-2 mr-4 py-2'>Sign up to complete tasks</Link> 
            */}
            <button
              onClick={() => signIn('google')}
              className='bg-theme-green text-white  h-full  text-theme-green inline-flex gap-1 items-center px-2 py-2'
            >
              Login/Sign Up to Post Tasks
            </button>
          </>
        )}
        {session?.user && (
          <>
            <div className='relative'>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                title='profile-button'
              >
                <Image
                  className={'rounded-md' + (showDropdown ? 'z-50' : '')}
                  src={session.user.image as string}
                  alt={'avatar'}
                  width={36}
                  height={36}
                />
              </button>
              {showDropdown && (
                <>
                  <div
                    onClick={() => setShowDropdown(false)}
                    className='bg-black/50 fixed inset-0 z-40'
                  ></div>
                  <div className='absolute z-50 right-0 top-8 bg-white rounded-md w-24 border'>
                    <button
                      className='p-2 block text-center cursor-pointer w-full'
                      onClick={() => {
                        setShowDropdown(false)
                        router.push('/my-ads')
                      }}
                    >
                      My Ads
                    </button>
                    <button
                      className='p-2 block w-full cursor-pointer'
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
