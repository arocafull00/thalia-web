"use client";

import { ToastContainer } from "react-toastify";

export default function AppToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      theme="light"
      autoClose={5000}
      closeOnClick
      pauseOnHover
      aria-label="Notificaciones"
    />
  );
}
