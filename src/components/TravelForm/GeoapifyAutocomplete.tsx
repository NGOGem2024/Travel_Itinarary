import React, { useState } from "react";

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

interface GeoapifyFeature {
  properties: {
    place_id: string;
    formatted: string;
  };
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const GeoapifyAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);

  const fetchSuggestions = async (text: string) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    setSuggestions((data.features || []) as GeoapifyFeature[]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const text = e.target.value;
          onChange(text);
          fetchSuggestions(text);
        }}
        autoComplete="off"
      />

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            borderRadius: "8px",
            listStyle: "none",
            padding: "6px 0",
            margin: "4px 0 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 99,
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.properties.place_id}
              onClick={() => {
                onChange(item.properties.formatted);
                setSuggestions([]);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              {item.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoapifyAutocomplete;
