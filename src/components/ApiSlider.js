import React, { useState, useEffect } from 'react';
import { Slider, LinearProgress } from '@mui/material';

export default function ApiSlider() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.github.com/users');
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Slider
      value={value}
      onChange={handleChange}
      min={0}
      max={data.length - 1}
      getAriaValueText={(value) => data[value].login}
      marks={data.map((item, index) => ({ value: index, label: item.login }))}
      valueLabelDisplay="on"
    />
  );
}
