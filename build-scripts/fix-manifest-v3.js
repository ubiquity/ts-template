const path = require("path");
const manifestPath = path.join(__dirname, "../dist/webext-prod/manifest.json");
const manifestV2 = require(manifestPath);
const manifestV3 = { ...manifestV2 };
manifestV3.manifest_version = 3;
if (manifestV2["web_accessible_resources"]) {
  manifestV3["web_accessible_resources"] = [
    {
      matches: ["<all_urls>"],
      resources: manifestV2["web_accessible_resources"],
    },
  ];
}
manifestV3["background"]["service_workers"] =
  manifestV3["background"]["scripts"];
delete manifestV3["background"]["scripts"];

if ("persistent" in manifestV3["background"])
  delete manifestV3["background"]["persistent"];

if (manifestV2["browser_action"] || manifestV2["page_action"]) {
  manifestV3["action"] = {
    ...manifestV2["browser_action"],
    ...manifestV2["page_action"],
  };

  if (manifestV3["browser_action"]) delete manifestV3["browser_action"];
  if (manifestV3["page_action"]) delete manifestV3["page_action"];
}

manifestV3["content_security_policy"] = {
  extension_pages: manifestV2["content_security_policy"],
  sandbox: "sandbox allow-scripts;",
};

require("fs").writeFileSync(manifestPath, JSON.stringify(manifestV3, null, 2));
