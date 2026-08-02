import { describe, it, expect, beforeEach, vi } from "vitest";

import * as clinicsDal from "@/dal/clinics.dal";
import { useClinicStore } from "@/stores/clinic-store";

vi.mock("@/dal/clinics.dal", () => ({
  getMemberships: vi.fn(),
}));

const USER_ID = "00000000-0000-0000-0000-000000000010";

const singleClinicRow = {
  id: "mem-1",
  clinic_id: "clinic-1",
  role: "admin",
  status: "active",
  clinics: {
    id: "clinic-1",
    name: "Clínica Central",
    logo_url: "https://logo.png",
    timezone: "Europe/Madrid",
  },
};

const arrayClinicRow = {
  id: "mem-2",
  clinic_id: "clinic-2",
  role: "doctor",
  status: "active",
  clinics: [
    {
      id: "clinic-2",
      name: "Clínica Norte",
      logo_url: null,
      timezone: "Europe/Paris",
    },
  ],
};

const nullClinicRow = {
  id: "mem-3",
  clinic_id: "clinic-3",
  role: "external",
  status: "active",
  clinics: null,
};

describe("clinic-store", () => {
  beforeEach(() => {
    useClinicStore.setState({
      memberships: [],
      activeClinicId: null,
      loading: false,
      hydrated: true,
    });
  });

  it("has correct default state", () => {
    const state = useClinicStore.getState();
    expect(state.memberships).toEqual([]);
    expect(state.activeClinicId).toBeNull();
    expect(state.loading).toBe(false);
  });

  describe("fetchMemberships", () => {
    it("normalizes single clinic object and sets memberships", async () => {
      vi.mocked(clinicsDal.getMemberships).mockResolvedValue([
        singleClinicRow as never,
      ]);

      const result = await useClinicStore.getState().fetchMemberships(USER_ID);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "mem-1",
        clinicId: "clinic-1",
        clinicName: "Clínica Central",
        clinicLogoUrl: "https://logo.png",
        clinicTimezone: "Europe/Madrid",
        role: "admin",
        status: "active",
      });
      expect(useClinicStore.getState().activeClinicId).toBe("clinic-1");
      expect(useClinicStore.getState().loading).toBe(false);
    });

    it("normalizes array clinic and picks first element", async () => {
      vi.mocked(clinicsDal.getMemberships).mockResolvedValue([
        arrayClinicRow as never,
      ]);

      await useClinicStore.getState().fetchMemberships(USER_ID);

      const state = useClinicStore.getState();
      expect(state.memberships[0].clinicName).toBe("Clínica Norte");
    });

    it("falls back to 'Clínica' when clinics join is null", async () => {
      vi.mocked(clinicsDal.getMemberships).mockResolvedValue([
        nullClinicRow as never,
      ]);

      await useClinicStore.getState().fetchMemberships(USER_ID);

      const state = useClinicStore.getState();
      expect(state.memberships[0].clinicName).toBe("Clínica");
      expect(state.memberships[0].clinicLogoUrl).toBeNull();
    });

    it("sets activeClinicId to first membership when persisted id is invalid", async () => {
      useClinicStore.setState({ activeClinicId: "nonexistent" });

      vi.mocked(clinicsDal.getMemberships).mockResolvedValue([
        singleClinicRow as never,
      ]);

      await useClinicStore.getState().fetchMemberships(USER_ID);

      expect(useClinicStore.getState().activeClinicId).toBe("clinic-1");
    });

    it("returns existing memberships on DAL failure", async () => {
      useClinicStore.setState({
        memberships: [
          {
            id: "mem-1",
            clinicId: "clinic-1",
            clinicName: "Clínica Central",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "admin" as const,
            status: "active" as const,
          },
        ],
      });

      vi.mocked(clinicsDal.getMemberships).mockRejectedValue(
        new Error("network error"),
      );

      const result = await useClinicStore.getState().fetchMemberships(USER_ID);

      expect(result).toHaveLength(1);
      expect(useClinicStore.getState().loading).toBe(false);
    });
  });

  describe("setActiveClinic", () => {
    it("updates activeClinicId", () => {
      useClinicStore.getState().setActiveClinic("clinic-2");
      expect(useClinicStore.getState().activeClinicId).toBe("clinic-2");
    });
  });

  describe("clearClinicState", () => {
    it("resets to initial state", () => {
      useClinicStore.setState({
        memberships: [
          {
            id: "mem-1",
            clinicId: "clinic-1",
            clinicName: "Test",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "admin" as const,
            status: "active" as const,
          },
        ],
        activeClinicId: "clinic-1",
      });

      useClinicStore.getState().clearClinicState();

      const state = useClinicStore.getState();
      expect(state.memberships).toEqual([]);
      expect(state.activeClinicId).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe("getActiveMembership", () => {
    it("returns matching membership", () => {
      const membership = {
        id: "mem-1",
        clinicId: "clinic-1",
        clinicName: "Clínica Central",
        clinicLogoUrl: null,
        clinicTimezone: null,
        role: "admin" as const,
        status: "active" as const,
      };
      useClinicStore.setState({
        memberships: [membership],
        activeClinicId: "clinic-1",
      });

      const result = useClinicStore.getState().getActiveMembership();
      expect(result).toEqual(membership);
    });

    it("returns null when no active clinic", () => {
      useClinicStore.setState({
        memberships: [],
        activeClinicId: null,
      });

      const result = useClinicStore.getState().getActiveMembership();
      expect(result).toBeNull();
    });

    it("returns null when active clinic not in memberships", () => {
      useClinicStore.setState({
        memberships: [
          {
            id: "mem-1",
            clinicId: "clinic-1",
            clinicName: "Clínica Central",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "admin" as const,
            status: "active" as const,
          },
        ],
        activeClinicId: "nonexistent",
      });

      const result = useClinicStore.getState().getActiveMembership();
      expect(result).toBeNull();
    });
  });

  describe("getExternalMemberships", () => {
    it("filters memberships with role external", () => {
      useClinicStore.setState({
        memberships: [
          {
            id: "mem-1",
            clinicId: "clinic-1",
            clinicName: "Central",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "admin" as const,
            status: "active" as const,
          },
          {
            id: "mem-2",
            clinicId: "clinic-2",
            clinicName: "External",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "external" as const,
            status: "active" as const,
          },
          {
            id: "mem-3",
            clinicId: "clinic-3",
            clinicName: "Another External",
            clinicLogoUrl: null,
            clinicTimezone: null,
            role: "external" as const,
            status: "active" as const,
          },
        ],
      });

      const result = useClinicStore.getState().getExternalMemberships();
      expect(result).toHaveLength(2);
      expect(result[0].clinicId).toBe("clinic-2");
      expect(result[1].clinicId).toBe("clinic-3");
    });
  });
});
