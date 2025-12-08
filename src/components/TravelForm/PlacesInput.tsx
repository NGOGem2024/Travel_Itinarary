import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

interface PlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PlacesInput: React.FC<PlacesInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const {
    ready,
    value: inputValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleSelect = (description: string) => {
    setValue(description, false);
    onChange(description);
    clearSuggestions();
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        disabled={!ready}
      />

      {status === "OK" && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "4px 0",
            zIndex: 100,
            listStyle: "none",
            marginTop: "4px",
          }}
        >
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlacesInput;
