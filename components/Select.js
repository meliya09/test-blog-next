import { useEffect, useState } from "react";
import ReactSelect from "react-select";

const Select = ({
  field,
  form: { setFieldValue },
  options = [],
  defaultValue,
  ...props
}) => {
  const [selectOptions, setSelectOptions] = useState(options);
  const [value, setValue] = useState(null);

  const onChange = (object, { action }) => {
    switch (action) {
      case "input-change":
        if (object) {
          setValue(object);
          setFieldValue(field.name, object.value);
        }
        return;
      case "menu-close":
        return;
      case "clear":
        if (defaultValue) {
          setValue(object);
          setFieldValue(field.name, defaultValue.value);
        }
        return;
      case "select-option":
        if (object) {
          setValue(object);
          setFieldValue(field.name, object.value);
        }
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    if (field.value) {
      const selectedOption = selectOptions.find(
        (option) => option.value === field.value
      );

      setValue(selectedOption);
      setFieldValue(field.name, field.value);
    } else {
      if (defaultValue) {
        setValue(defaultValue);
        setFieldValue(field.name, defaultValue.value);
      }
    }
  }, [field.value]);

  useEffect(() => {
    setSelectOptions(options);
  }, [options]);

  return (
    <ReactSelect
      maxMenuHeight={120}
      value={value}
      options={selectOptions}
      isLoading={selectOptions.length === 0}
      isDisabled={selectOptions.length === 0 || props.disabled}
      onChange={onChange}
      {...props}
    />
  );
};

export default Select;
