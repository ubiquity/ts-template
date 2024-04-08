import { LinkedInUser } from "../../../../@types/User";

export function fetchUserProfileFullName(): string {
  const codes = document.querySelectorAll(`code`);
  let x = codes.length;
  while (x--) {
    const code = codes[x];
    if (!code || !code.textContent) {
      continue;
    }
    try {
      const parsed = JSON.parse(code.textContent);
      console.log({ parsed });
      if (parsed.memberResolutionResult) {
        return parsed.memberResolutionResult.fullName;
      }
    } catch (e) {}
  }
  return "";
}

export function fetchUserProfileFullNameV2(): string {
  const nameSelector = `
	.app-header-item-content.app-header-item-content--type-entity.entity-size-1.entity-type-person
	.a11y-text
	`;
  const node = document.querySelector(nameSelector);
  // console.log({ node });
  if (node && node.textContent) {
    return node.textContent.trim();
  }
  return fetchUserProfileFullName();
}

export function fetchUserProfileFullNameV3(): string {
  const codes = document.getElementsByTagName("code");
  const key = "memberResolutionResult";
  for (let x = 0; x < codes.length; x++) {
    const code = codes[x];
    if (!code || !code.textContent) {
      continue;
    }
    const found = code.textContent.includes(key);
    if (found) {
      try {
        const parsed = JSON.parse(code.textContent);
        // console.log({ parsed });
        if (parsed.memberResolutionResult) {
          return parsed.memberResolutionResult.fullName;
        }
      } catch (e) {}
    }
  }

  return fetchUserProfileFullNameV2();
}

export function fetchUserProfileInfo(): LinkedInUser | null {
  const codes = document.getElementsByTagName("code");
  const key = "memberResolutionResult";
  for (let x = 0; x < codes.length; x++) {
    const code = codes[x];
    if (!code || !code.textContent) {
      continue;
    }
    const found = code.textContent.includes(key);
    if (found) {
      try {
        const parsed = JSON.parse(code.textContent);
        // console.log({ parsed });
        if (parsed.memberResolutionResult) {
          return parsed.memberResolutionResult;
        }
      } catch (e) {}
    }
  }
  return null;
}
