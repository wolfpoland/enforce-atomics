import { PluginOption } from "../../types/plugin-option";

export function retrieveOptions(options: PluginOption): PluginOption {
  if (!options?.css) {
    throw new Error("Option css must be provided!");
  }

  if (options.propertiesWhitelist) {
    console.warn("propertiesWhitelist is not supported");
  }

  return options;
}
