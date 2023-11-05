import React from "react";
import useDataFetch from "../src/hooks/useDataFetch";

export default function HomePage() {
  const {
    cityData,
    aqiColor,
    aqiCategory,
    error,
    isLoading,
    handleClick,
    refetch,
  } = useDataFetch();

  const cityChoices = [
    { buttonLabel: "My Location", slug: "here" },
    { buttonLabel: "New York City", slug: "new-york-city" },
    { buttonLabel: "Shanghai", slug: "shanghai" },
    { buttonLabel: "Bangkok", slug: "bangkok" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (cityData) {
    let measurementTime = new Date(cityData.time.s);
    const lastUpdated = timeHumanReadable(measurementTime);
    return (
      <div className="px-0 sm:px-64 pb-40 pt-16 bg-orange-50">
        <div className="text-center text-3xl pb-4">
          Air Quality Index (AQI) Viewer
        </div>

        <div className="bg-white mt-4 p-4 rounded-xl">
          <div className="mb-2">
            To view AQI data for a particular city, click its corresponding
            button below.
          </div>
          <div className="flex gap-x-2">
            {cityChoices.map((choice) => (
              <button
                className="bg-emerald-700 hover:bg-emerald-900 focus:bg-emerald-900 text-white font-bold py-2 px-4 rounded"
                key={choice.slug}
                data-testid={choice.slug}
                onClick={() => handleClick(choice.slug)}
              >
                {choice.buttonLabel}
              </button>
            ))}
          </div>
        </div>

        <div data-testid="results" className="text-center text-2xl mt-6">
          {cityData.city.name}
          <br />
          as of {lastUpdated}
          <br />
        </div>

        <div className="flex flex-col">
          <div
            className={`${aqiColor} aqi-scale-by-color grid align-middle content-center mx-auto mt-4 px text-center text-3xl`}
          >
            <div className="w-full">{cityData.aqi}</div>
            <div className="w-full">{aqiCategory}</div>
          </div>
          <div className="bg-white mt-4 p-4 rounded-xl">
            <div className="font-bold">Date and Time of measurement:</div>{" "}
            {lastUpdated}
            <div className="mt-2">
              To view the most recent AQI measurement at this station location
              in&nbsp;
              {cityData.city.name}, click the button below.
            </div>
            <button
              onClick={refetch}
              data-testid="refresh-button"
              className="mt-4 bg-emerald-700 hover:bg-emerald-900 focus:bg-emerald-900 text-white font-bold py-2 px-4 rounded"
            >
              Get the latest data for {cityData.city.name}
            </button>
          </div>
          <table className="table-auto px-auto mx-auto my-4 border-collapse w-full text-sm">
            <thead>
              <tr>
                <th className="border-slate-900 bg-neutral-300 font-medium p-4 pl-8 py-3 text-slate-800 text-left">
                  Numeric AQI
                </th>
                <th className="border-slate-900 bg-neutral-300 font-medium p-4 pl-8 py-3 text-slate-800 text-left">
                  City name
                </th>
                <th className="border-slate-900 bg-neutral-300 font-medium p-4 pl-8 py-3 text-slate-800 text-left">
                  Station location (Latitude, Longitude)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white rounded-xl ring-1 ring-slate-900/5 shadow-xl">
              <tr>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                  {cityData.aqi}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                  {cityData.city.name}
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                  {cityData.city.geo[0]}, {cityData.city.geo[1]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

function timeHumanReadable(measurementTime) {
  let appendZero = function (num) {
    return (num < 10 ? "0" : "") + num;
  };
  let year = measurementTime.getFullYear();
  let month = measurementTime.getMonth() + 1;
  let dt = measurementTime.getDate();
  let hours = measurementTime.getHours() + ":";
  let minutes = appendZero(measurementTime.getMinutes());
  let tzOffset = -measurementTime.getTimezoneOffset(),
    aheadOrBehindGMT = tzOffset >= 0 ? "+" : "-";
  let timezone =
    appendZero(Math.floor(Math.abs(tzOffset) / 60)) +
    ":" +
    appendZero(Math.abs(tzOffset) % 60);

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return (
    year +
    "-" +
    month +
    "-" +
    dt +
    " at " +
    hours +
    minutes +
    " GMT" +
    aheadOrBehindGMT +
    timezone
  );
}
