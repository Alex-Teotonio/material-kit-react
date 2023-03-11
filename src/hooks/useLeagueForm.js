import { useState } from 'react';

export const useLeagueForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!values.name) {
      errors.name = 'O nome é obrigatório';
    }

    if (!values.short) {
      errors.short = 'A sigla é obrigatória';
    }

    if (!values.numberTeams) {
      errors.numberTeams = 'O número de times é obrigatório';
    } else if (values.numberTeams < 0) {
      errors.numberTeams = 'O número de times deve ser positivo';
    } else if (values.numberTeams % 2 !== 0) {
      errors.numberTeams = 'O número de times deve ser um número par';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return { values, errors, handleChange, validate };
};
