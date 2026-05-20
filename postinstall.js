import { execSync } from "child_process";

if (process.env.RENDER === "true") {
  console.log("Render environment detected. Running build step...");
  execSync("npm run build", { stdio: "inherit" });
} else {
  console.log("Local environment detected. Skipping postinstall build.");
}
