'use client'

import { useEffect, useRef, useState } from 'react'
import { categories, defaultRadius } from '../../libs/helpers'
import { faStore } from '@fortawesome/free-solid-svg-icons'
import LabelRadioButton from './LabelRadioButton'
import SubmitButton from './SubmitButton'
import DistancePicker from './DistancePicker'
import { Location } from './LocationPicker'
import useCurrentLocation from '../hooks/useCurrentLocation'
import useRadius from '../hooks/useRadius'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

type Props = {
  onSearch: (formData: FormData) => void
}

export default function SearchForm ({ onSearch }: Props) {
  const radius = useRadius(state => state.radius)
  const setRadius = useRadius(state => state.setRadius)
  const center = useCurrentLocation(state => state.currLocation)
  const setCenter = useCurrentLocation(state => state.setCurrLocation)
  const [prevCenter, setPrevCenter] = useState<Location | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [fixedFilterClicked, setFixedFilterClicked] = useState<boolean>(false)
  const [hourlyFilterClicked, setHourlyFilterClicked] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  useEffect(() => {
    if (center && !prevCenter) {
      formRef.current?.requestSubmit()
      setPrevCenter(center)
    }
  }, [center])

  function handleMinPriceChange (e: React.ChangeEvent<HTMLInputElement>) {
    setMinPrice(e.target.value)
  }

  function handleMaxPriceChange (e: React.ChangeEvent<HTMLInputElement>) {
    setMaxPrice(e.target.value)
  }

  function handleCategoryChange (category: string) {
    setSelectedCategory(category)
    const formData = new FormData(formRef.current!)
    formData.set('category', category)
    onSearch(formData)
  }

  function handleOnlyHourly () {
    // using this variable since react will update the state once the function exists and not in time
    // before the onSearch function executes
    let searchState
    if (!hourlyFilterClicked) {
      searchState = true
      setFixedFilterClicked(false)
      setHourlyFilterClicked(true)
    } else {
      searchState = undefined
      setHourlyFilterClicked(false)
    }
    const formData = new FormData(formRef.current!)
    formData.set('hourly', JSON.stringify(searchState))
    console.log(formData.get('hourly'))
    onSearch(formData)
  }

  function handleFixedRateOnly () {
    let searchState
    if (!fixedFilterClicked) {
      searchState = false
      setFixedFilterClicked(true)
      setHourlyFilterClicked(false)
    } else {
      searchState = undefined
      setFixedFilterClicked(false)
      console.log('here')
    }
    // setIsPayingHourly(false)
    const formData = new FormData(formRef.current!)
    formData.set('hourly', JSON.stringify(searchState))
    console.log(formData)
    onSearch(formData)
  }

  useEffect(() => {
    if (center) formRef.current?.requestSubmit()
  }, [])
  return (
    <form
      ref={formRef}
      action={onSearch}
      className='bg-white grow w-1/4 p-4 border-r flex flex-col gap-4'
    >
      <input name='phrase' type='text' placeholder='Search SIDEQUE$T...' />
      <div className='flex flex-col gap-0'>
        <LabelRadioButton
          key={'category'}
          name={'category'}
          value={''}
          icon={faStore}
          onClick={handleCategoryChange}
          isSelected={selectedCategory === ''}
          label={'All Categories'}
        />
        {categories.map(({ key: categoryKey, label, icon }) => (
          <LabelRadioButton
            key={categoryKey}
            name={'category'}
            value={categoryKey}
            icon={icon}
            onClick={handleCategoryChange}
            isSelected={selectedCategory === categoryKey}
            label={label}
          />
        ))}
      </div>

      <div>
      <label>Preferred Quest Modality</label>
      <div className='flex justify-between items-center flex-wrap'>
        <div className='shrink'>
          {hourlyFilterClicked && (
            <FontAwesomeIcon
              onClick={() => setFixedFilterClicked(false)}
              className='relative bottom-2 left-5 cursor-pointer'
              icon={faX}
              color='white'
            />
          )}
          <input
            className={
              (hourlyFilterClicked
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-400 border border-gray-400') +
              ' mt-2 px-6 py-2 rounded cursor-pointer wrap'
            }
            type='button'
            name='hourly'
            value={'Hourly Only'}
            onClick={handleOnlyHourly}
          />
        </div>

        <div className='shrink'>
          {fixedFilterClicked && (
            <FontAwesomeIcon
              onClick={() => setFixedFilterClicked(false)}
              className='relative bottom-2 left-5 cursor-pointer'
              icon={faX}
              color='white'
            />
          )}
          <input
            className={
              (fixedFilterClicked
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-400 border border-gray-400') +
              ' mt-2 px-6 py-2 rounded cursor-pointer wrap'
            }
            type='button'
            name='hourly'
            value={'Fixed Only'}
            onClick={handleFixedRateOnly}
          />
        </div>
      </div>
      </div>

      

      <div className=''>
        <label>Filter by price</label>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <input
              name='min'
              type='number'
              placeholder='min'
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <input
              name='max'
              type='number'
              placeholder='max'
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>
      <div>
        <input type='hidden' name='radius' value={radius}></input>
        <input
          type='hidden'
          name='center'
          value={[JSON.stringify(center?.lat), JSON.stringify(center?.lng)]}
        ></input>
        <DistancePicker
          defaultRadius={defaultRadius}
          onChange={({ radius, center }) => {
            setRadius(radius)
            setCenter(center)
          }}
        />
      </div>
      <SubmitButton>Search</SubmitButton>
    </form>
  )
}
