"use client";

import { useEffect, useState } from "react";

export default function useDataFetch() {
  const [cityData, setCityData] = useState(null);
  const [citySlug, setCitySlug] = useState("here");
  const [aqiColor, setAqiColor] = useState("");
  const [aqiCategory, setAqiCategory] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const url = process.env.API_HOST;
      const token = process.env.AQICN_TOKEN;
      const response = await fetch(`${url}${citySlug}/?token=${token}`);
      const res = await response.json();
      setCityData(res.data);
      setAqiColor(getAqiColor(res.data.aqi));
      setAqiCategory(getAqiCategory(res.data.aqi));
      setIsLoading(false);

      // save new data to local storage
      const cityArray = [];
      let citySavedToLocalStorage = localStorage.setItem(
        citySlug,
        JSON.stringify(res.data)
      );
      cityArray.push(citySavedToLocalStorage);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem(citySlug) != null &&
      localStorage.getItem(citySlug) != "{}"
    ) {
      // city was previously saved to local storage, so use localStorage
      const parsedData = JSON.parse(localStorage.getItem(citySlug));
      setCityData(parsedData);
      setAqiColor(getAqiColor(parsedData.aqi));
      setAqiCategory(getAqiCategory(parsedData.aqi));
    } else {
      // city is not in local storage, so fetch data from API
      fetchData();
    }
  }, [citySlug]);

  const handleClick = (citySlug) => {
    setCitySlug(citySlug);
  };

  const refetch = () => {
    fetchData();
  };

  return {
    cityData,
    aqiColor,
    aqiCategory,
    error,
    isLoading,
    handleClick,
    refetch,
  };
}

function getAqiColor(aqi) {
  if (aqi <= 50) {
    return "bg-green-500";
  } else if (aqi <= 100) {
    return "bg-yellow-500";
  } else if (aqi <= 150) {
    return "bg-orange-500";
  } else if (aqi <= 200) {
    return "bg-red-700";
  } else if (aqi <= 300) {
    return "bg-indigo-700";
  } else if (aqi > 300) {
    return "bg-rose-950";
  }
}

function getAqiCategory(aqi) {
  if (aqi <= 50) {
    return "Good";
  } else if (aqi <= 100) {
    return "Moderate";
  } else if (aqi <= 150) {
    return "Unhealthy for sensitive groups";
  } else if (aqi <= 200) {
    return "Unhealthy";
  } else if (aqi <= 300) {
    return "Very unhealthy";
  } else if (aqi > 300) {
    return "Hazardous";
  }
}
