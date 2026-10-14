import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

const useSearch = (control, onSearchForm) => {
  const formValue = useWatch({ control });
  const searchText = JSON.stringify(formValue);
  const [lastText, setLastText] = useState(searchText);

  const isEmpty = Object.values(formValue).every((value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return text.trim() === "";
  });

  useEffect(() => {
    if (searchText === lastText) return;
    const timer = setTimeout(() => {
      setLastText(searchText);
      onSearchForm();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  return { isEmpty };
};

export default useSearch;
