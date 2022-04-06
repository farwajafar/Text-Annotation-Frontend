import React from "react";
import { Redirect } from "react-router-dom";
import { FuseUtils } from "@fuse";
// import { TemperatureConfig } from "app/main/apps/Temperature/TemperatueConfig";
import { LoginConfig } from "app/main/login/LoginConfig";
import { LogoutConfig } from "app/main/logout/LogoutConfig";
import { RainfallConfig } from "app/main/apps/Rainfall/RainfallConfig";
// import { AirPressureConfig } from "app/main/apps/AirPressure/AirPressureConfig";

// import { WindSpeedConfig } from "app/main/apps/Wind-Speed/WindSpeedConfig";
// import { FarmerTableConfig } from "app/main/apps/FarmerTable/FarmerTableConfig";

// import { HumidityConfig } from "app/main/apps/Humidity/HumidityConfig";
// import { ExampleConfig } from "app/main/apps/Example/ExampleConfig";
const routeConfigs = [
  // TemperatureConfig,
  // ExampleConfig,
  RainfallConfig,
  // AirPressureConfig,
  // FarmerTableConfig,
  // HumidityConfig,
  // WindSpeedConfig,
  LoginConfig,
  LogoutConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    component: () => <Redirect to="/rainfall" />,
  },
  // {
  //   path: "/",
  //   component: () => <Redirect to="/dashboard/farmertable" />,
  // },
 
  // {
  //   path: "/",
  //   component: () => <Redirect to="/temperature" />,
  // },
  // {
  //   path: "/",
  //   component: () => <Redirect to="/airpressure" />,
  // },
  // {
  //   path: "/",
  //   component: () => <Redirect to="/windspeed" />,
  // },
  // {
  //   path: "/",
  //   component: () => <Redirect to="/humidity" />,
  // },
];

export default routes;
