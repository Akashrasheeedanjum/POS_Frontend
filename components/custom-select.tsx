'use client';
import { useState, useRef, useEffect } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import { City, Country, getAllCities, getAllCountries } from "@/lib/actions/customers.actions";
import { toast } from "sonner";


type SelectType = 'cities' | 'countries';

export function CustomSelect({
  type,
  value,
  onChange,
  placeholder = "Select",
  extraOption,
  allowInput = false,
}: {
  type: SelectType;
  value: string | undefined;
  onChange: (val: any) => void;
  placeholder?: string;
  extraOption?: { label: string; value: string };
  allowInput?: boolean;
}) {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, countriesRes] = await Promise.all([
          getAllCities(),
          getAllCountries(),
        ]);
        setCities(Array.isArray(citiesRes) ? citiesRes : []);
        setCountries(Array.isArray(countriesRes) ? countriesRes : []);
      } catch (error) {
        console.error("Error fetching cities or countries", error);
        setCities([]);
        setCountries([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Keep input value in sync with selected value
    // if (value !== inputValue) {
      setInputValue(value || "");
    // }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = type === "cities" ? cities : countries;
  const getLabel = (item: any) => (type === "cities" ? item.cityName : item.countryName);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Input + Dropdown Button in Flex */}
      {allowInput ? (
  <div className="flex items-center w-full border border-input rounded-md shadow-sm focus-within:ring-1 focus-within:ring-ring">
    <input
      type="text"
      className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none rounded-l-md"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
      }}
    />
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      className="h-full px-3 border-l border-border flex items-center justify-center rounded-r-md"
    >
      <CaretSortIcon className="h-4 w-4 opacity-50" />
    </button>
  </div>
) : (
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <CaretSortIcon className="h-4 w-4 opacity-50" />
      </button>
)}
  

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-border bg-popover shadow-md max-h-20 overflow-y-auto">
          {extraOption && (
            <div
              key="extra"
              onClick={() => {
                onChange(extraOption.value);
                setIsOpen(false);
              }}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                // extraOption.value === value && "bg-accent"
                (extraOption.value === value && !allowInput) && "bg-accent"
              )}
            >
              {extraOption.label}
            </div>
          )}

          {options?.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                onChange(item); // send string only
                setIsOpen(false);
              }}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-accent",
                // getLabel(item) === value && "bg-accent"
                (getLabel(item) === value && !allowInput) && "bg-accent"
              )}
            >
              {getLabel(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


