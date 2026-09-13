import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useResendCooldown } from "@/lib/hooks/use-resend-cooldown";

const USUARIO = "00000000-0000-4000-8000-000000000001";

describe("cuenta atrás entre reenvíos", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("empieza sin espera", () => {
    const { result } = renderHook(() => useResendCooldown(USUARIO));

    expect(result.current.isCoolingDown).toBe(false);
    expect(result.current.secondsLeft).toBe(0);
  });

  it("arranca en 60 y va bajando", () => {
    const { result } = renderHook(() => useResendCooldown(USUARIO));

    act(() => result.current.start());
    expect(result.current.secondsLeft).toBe(60);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.secondsLeft).toBe(57);
    expect(result.current.isCoolingDown).toBe(true);
  });

  it("se libera al agotarse", () => {
    const { result } = renderHook(() => useResendCooldown(USUARIO));

    act(() => result.current.start());
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isCoolingDown).toBe(false);
  });

  it("sobrevive a recargar la página", () => {
    // Es el motivo de usar localStorage: con estado en memoria bastaría
    // refrescar para ver el botón activo, y Supabase rechazaría el envío igual.
    const primera = renderHook(() => useResendCooldown(USUARIO));
    act(() => primera.result.current.start());
    primera.unmount();

    const segunda = renderHook(() => useResendCooldown(USUARIO));

    expect(segunda.result.current.isCoolingDown).toBe(true);
  });

  it("no comparte la espera entre usuarios del mismo navegador", () => {
    const primero = renderHook(() => useResendCooldown(USUARIO));
    act(() => primero.result.current.start());

    const segundo = renderHook(() =>
      useResendCooldown("00000000-0000-4000-8000-0000000000ff"),
    );

    expect(primero.result.current.isCoolingDown).toBe(true);
    expect(segundo.result.current.isCoolingDown).toBe(false);
  });

  it("sin usuario no hay espera", () => {
    const { result } = renderHook(() => useResendCooldown(null));

    act(() => result.current.start());

    expect(result.current.isCoolingDown).toBe(false);
  });
});
