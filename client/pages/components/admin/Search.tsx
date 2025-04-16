import React, { useState } from "react";

function Search({
  value,
  onChangeSearch,
  placeholder = "Search",
}: {
  value?: string;
  onChangeSearch: (value: string) => void;
  placeholder?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={`input-group  rounded-[0.25rem] w-full flex ${
        isFocused ? "border-[1px] border-primary" : " border-[1px] border-light"
      }`}
    >
      <a
        aria-label="anchor"
        href="#!"
        className="input-group-text flex items-center bg-light !border-0 !py-[0.375rem] !px-[0.75rem] !rounded-[0.25rem] !text-[0.875rem]"
        id="Search-Grid"
      >
        <i className="fe fe-search header-link-icon text-[0.875rem]"></i>
      </a>

      <input
        type="search"
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        className="form-control border-0 px-2 !text-[0.8rem] w-full focus:ring-transparent"
        placeholder={placeholder}
        aria-label="Username"
        value={value}
        autoComplete="off"
        onChange={(ele) => {
          onChangeSearch(ele.target.value);
          //   setInputValue(ele.target.value);
        }}
      />
    </div>
  );
}

export default Search;
