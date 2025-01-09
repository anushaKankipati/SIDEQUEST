interface FilterButtonProps {
  onClick: () => void; 
  value: string; 
  isPayingHourly?: boolean;
}

export default function FilterButton({value, onClick, isPayingHourly}: FilterButtonProps) {
  return (
    <div>
      <input className={(isPayingHourly ? 'bg-gray-400' : 'bg-blue-600') + " mt-2 text-white px-6 py-2 rounded"} type="button" value={value} onClick={onClick}/>
    </div>
  )
}