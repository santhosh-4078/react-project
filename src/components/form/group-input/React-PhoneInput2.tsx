import React from 'react';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
}

const PhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  error = false,
  placeholder = 'Enter phone number',
}) => {
  return (
    <div className="w-full">
      <PhoneInputLib
        country={'in'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputStyle={{
          width: '100%',
          height: '44px',
          borderColor: error ? '#f87171' : '#d1d5db',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
        inputClass={`!w-full !rounded-lg !border !bg-transparent !text-sm 
          !text-gray-800 !shadow-theme-xs !placeholder:text-gray-400 
          !focus:border-brand-300 !focus:outline-hidden !focus:ring-3 !focus:ring-brand-500/10 
          dark:!border-gray-700 dark:!bg-dark-900 dark:!text-white/90 dark:!placeholder:text-white/30 
          dark:!focus:border-brand-800 ${error ? '!border-red-400' : '!border-gray-300'}`}
        containerClass="!w-full !relative"
        buttonClass="!border-r !rounded-lg !border-gray-300 dark:!border-gray-700 !bg-transparent"
        dropdownClass="!bg-white dark:!bg-dark-800 !text-sm !z-[999]"
        enableSearch
        autoFormat
        disableCountryCode={false}
        disableDropdown={false}
      />
      {/* {error && (
        <p className="text-red-500 text-sm mt-1">Invalid phone number</p>
      )} */}
    </div>
  );
};

export default PhoneInput;