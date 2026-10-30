import { useEffect, useState } from "react";
import { getDropdown } from "@/services/dropdown";
import { onDataChange } from "@/services/data";

const useDropdown = (dataType) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(getDropdown(dataType));
    return onDataChange(() => setOptions(getDropdown(dataType)));
  }, [dataType]);

  return { options };
};

export default useDropdown;
