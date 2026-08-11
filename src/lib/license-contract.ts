interface LicenseClientRequest {
  readonly app_version?: unknown;
  readonly license_contract_version?: unknown;
}

export interface LicenseClientMetadata {
  readonly app_version: string | null;
  readonly license_contract_version: number;
}

export function licenseClientMetadata(
  request: LicenseClientRequest
): LicenseClientMetadata {
  const rawVersion =
    typeof request.app_version === "string"
      ? request.app_version.trim()
      : "";
  const rawContractVersion = request.license_contract_version;

  return {
    app_version: rawVersion ? rawVersion.slice(0, 64) : null,
    license_contract_version:
      typeof rawContractVersion === "number" &&
      Number.isSafeInteger(rawContractVersion) &&
      rawContractVersion >= 1
        ? rawContractVersion
        : 1,
  };
}
