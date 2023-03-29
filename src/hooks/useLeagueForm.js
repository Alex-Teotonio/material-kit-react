import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLeagueForm = (initialValues) => {
  const {t} = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!values.name) {
      errors.name = t('nameRequired')
    }

    if (!values.short) {
      errors.short = t('initialsRequired')
    }

    if (!values.numberTeams) {
      errors.numberTeams = t('teamsRequired')
    } else if (values.numberTeams < 0) {
      errors.numberTeams = t('positiveNUmber');
    } else if (values.numberTeams % 2 !== 0) {
      errors.numberTeams = t('evenNumber');
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return { values, errors, handleChange, validate };
};
