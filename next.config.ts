import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone/tablet access to Next dev resources over LAN.
  // Update this IP if your local network address changes.
  allowedDevOrigins: ["192.168.0.75"],
};

export default nextConfig;
