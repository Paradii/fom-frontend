import { useEffect, useState } from "react";
import { getDropdown } from "@/services/dropdown";

const useDropdown = (dataType) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(getDropdown(dataType));
  }, [dataType]);

  return { options };
};

export default useDropdown;
