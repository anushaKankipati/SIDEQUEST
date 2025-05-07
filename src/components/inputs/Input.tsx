"use client";

import clsx from "clsx";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

export default function Input({
  label,
  id,
  type,
  required,
  register,
  disabled,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `form-input 
            block w-full
            rounded-md
            border-1
            border-gray-400
            py-1.5
         text-gray-900 
            shadow-sm
            ring-1
            ring-inset
          ring-gray-300
          placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
          focus:theme-green
            sm:text-sm sm:leading-6`
          )}
        />
      </div>
    </div>
  );
}
