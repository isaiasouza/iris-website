import { describe, expect, it } from "vitest";
import { licenseClientMetadata } from "./license-contract";

describe("licenseClientMetadata", () => {
  it("contabiliza request sem license_contract_version como contrato 1", () => {
    expect(licenseClientMetadata({})).toEqual({
      app_version: null,
      license_contract_version: 1,
    });
  });

  it("preserva contrato 2 e app_version enviados pelo cliente novo", () => {
    expect(
      licenseClientMetadata({
        app_version: " 3.6.0 ",
        license_contract_version: 2,
      })
    ).toEqual({
      app_version: "3.6.0",
      license_contract_version: 2,
    });
  });
});
