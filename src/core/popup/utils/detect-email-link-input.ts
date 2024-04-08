import { firebaseUISelector } from "./firebase";
export const detectEmailLinkInput = () => {
  const emailLinkContainerSelector =
    ".firebaseui-container.firebaseui-id-page-sign-in";
  const emailLinkInputSelector = `#ui-sign-in-email-input`;

  const observerEmailLinkInput: MutationObserver = new MutationObserver(
    (mutationList: MutationRecord[]) => {
      const elementEmailLinkInput: HTMLInputElement | null | undefined = (
        mutationList.find((mutationRecord: MutationRecord) => {
          return (mutationRecord.target as HTMLElement)?.querySelector(
            emailLinkContainerSelector
          );
        })?.target as HTMLElement
      )
        ?.querySelector(emailLinkContainerSelector)
        ?.querySelector(emailLinkInputSelector) as HTMLInputElement;
      if (elementEmailLinkInput) {
        if (
          !elementEmailLinkInput.getAttribute("email-link-input-listener-set")
        ) {
          elementEmailLinkInput.addEventListener("change", () => {
            const emailLinkEmailRequest = elementEmailLinkInput.value;
            console.log(emailLinkEmailRequest);
            chrome.storage.local.set({ emailLinkEmailRequest });
          });
          elementEmailLinkInput.setAttribute(
            "email-link-input-listener-set",
            "true"
          );
        }
      }
    }
  );
  observerEmailLinkInput.observe(
    document.querySelector(firebaseUISelector) as Node,
    {
      childList: true,
      subtree: true,
    }
  );
};
