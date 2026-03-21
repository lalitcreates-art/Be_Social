import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lalitcreates.besocial",
  appName: "Be Social",
  webDir: "client/dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https"
  }
};

export default config;
