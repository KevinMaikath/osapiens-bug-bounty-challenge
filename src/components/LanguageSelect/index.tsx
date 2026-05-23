import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguages } from "../../i18n";

const LanguageSelect: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      variant="standard"
      disableUnderline
      sx={{
        color: "common.white",
        fontSize: "0.875rem",
        "& .MuiSvgIcon-root": { color: "common.white" },
        "& .MuiSelect-select:focus": { backgroundColor: "transparent" }
      }}
    >
      {defaultLanguages.map((locale) => (
        <MenuItem key={locale} value={locale}>
          {locale.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelect;
