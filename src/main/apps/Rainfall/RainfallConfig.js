import React from "react";
import { authRoles } from "app/auth";

export const RainfallConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.annotator,
  routes: [
    {
      path: "/rainfall",
      component: React.lazy(() => import("./Rainfall")),
    },
  ],
};
