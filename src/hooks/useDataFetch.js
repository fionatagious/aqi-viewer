"use client";

import { useEffect, useState } from "react";
import { aqiColorDict, aqiCategoryDict } from "../../app/consts";

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
      const aqiKey = getAqiKey(res.data.aqi);
      setAqiColor(aqiColorDict[aqiKey]);
      setAqiCategory(aqiCategoryDict[aqiKey]);
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
      const aqiKey = getAqiKey(parsedData.aqi);
      setAqiColor(aqiColorDict[aqiKey]);
      setAqiCategory(aqiCategoryDict[aqiKey]);
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

function getAqiKey(aqi) {
  if (aqi <= 50) {
    return "good";
  } else if (aqi <= 100) {
    return "moderate";
  } else if (aqi <= 150) {
    return "unhealthyForSensitiveGroups";
  } else if (aqi <= 200) {
    return "unhealthy";
  } else if (aqi <= 300) {
    return "veryUnhealthy";
  } else if (aqi > 300) {
    return "hazardous";
  }
}
