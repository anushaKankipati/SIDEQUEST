'use client'
import { useEffect, useState } from 'react'
import { Ad } from '../models/Ad'
import AdItem from '../components/AdItem'
import SearchForm from '../components/SearchForm'
import { error } from 'console'
import { defaultRadius, toTitleCase } from '../../libs/helpers'
import { json } from 'stream/consumers'
import useIsPayingHourly from '../hooks/useIsPayingHourly'

export default function Home () {
  const [ads, setAds] = useState<Ad[] | null>(null)
  const [adsParams, setAdsParams] = useState<URLSearchParams | null>(
    new URLSearchParams()
  )
  const isPayingHourly = useIsPayingHourly(state => state.isPayingHourly)
  useEffect(() => {
    fetchAds()
  }, [])

  function fetchAds (params?: URLSearchParams) {
    if (!params) {
      return //risky!!!! but seems to work
    }
    if (!params.has('radius')) {
      params.set('radius', defaultRadius.toString())
    }
    const url = `/api/ads?${params?.toString() || ''}`
    fetch(url)
      .then(response => response.json())
      .then(adsDocs => {
        setAds(adsDocs)
        setAdsParams(params)
      })
      .catch(err => {
        console.error(err)
      })
  }

  function handleSearch (formData: FormData) {
    if (!formData.has('center')) {
      return
    }

    const params = new URLSearchParams()
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        params.set(key, value)
      }
    })
    if (!params.get("hourly")) params.set("hourly", JSON.stringify(isPayingHourly))
    fetchAds(params)
  }
  const formDirty =
    adsParams?.get('phrase') ||
    adsParams?.get('category') ||
    adsParams?.get('min') ||
    adsParams?.get('max') 
  return (
    <div className='flex w-full h-screen'>
      <SearchForm onSearch={handleSearch} />
      <div className='p-4 grow bg-gray-100 w-3/4 overflow-y-auto'>
        <h2 className='font-bold mt-2 mb-4'>
          {formDirty
            ? 'Search Results for ' + toTitleCase(formDirty.toString())
            : 'Latest Ads'}
        </h2>
        <div className='grid md:grid-cols-4 gap-x-4 gap-y-6'>
          {ads && ads.map(ad => <AdItem key={ad._id} ad={ad} />)}
        </div>
        {ads && ads?.length === 0 && (
          <div className='text-gray-400'>No Products Found</div>
        )}
        {ads === null && <div className='text-gray-400'>Loading...</div>}
      </div>
    </div>
  )
}
