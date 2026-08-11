import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insertLicenseEvent: vi.fn(),
}));

vi.mock("@/lib/jwt", () => ({
  signValidationToken: vi.fn(async () => "validation-token-test"),
  tokenExpiresAt: vi.fn(() => new Date("2030-01-01T00:00:00Z")),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn((table: string) => {
      if (table === "licenses") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  id: "license-test",
                  license_key: "IRIS-TEST-TEST-TEST-TEST",
                  plan: "annual",
                  status: "active",
                  expires_at: "2031-01-01T00:00:00Z",
                },
              }),
            }),
          }),
        };
      }

      if (table === "devices") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  single: async () => ({ data: { id: "device-test" } }),
                }),
              }),
            }),
          }),
          update: () => ({
            eq: async () => ({ error: null }),
          }),
        };
      }

      if (table === "validation_tokens") {
        return {
          upsert: async () => ({ error: null }),
        };
      }

      if (table === "license_events") {
        return {
          insert: mocks.insertLicenseEvent,
        };
      }

      throw new Error(`Unexpected table in test: ${table}`);
    }),
  },
}));

import { POST } from "./route";

describe("POST /api/license/validate", () => {
  beforeEach(() => {
    mocks.insertLicenseEvent.mockReset();
    mocks.insertLicenseEvent.mockResolvedValue({ error: null });
  });

  it("persiste request legado sem campo como license_contract_version 1", async () => {
    const request = new NextRequest("http://localhost/api/license/validate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        license_key: "IRIS-TEST-TEST-TEST-TEST",
        hardware_id: "hardware-test",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mocks.insertLicenseEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "validated",
        metadata: {
          app_version: null,
          license_contract_version: 1,
        },
      })
    );
  });
});
