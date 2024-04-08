import curryObserveDomMutations from "./watch-for-connect-modal-popup";
import Lead from "../../../../../../@types/Lead";

const openConnectPromptButtonSelector = `artdeco-dropdown-item[data-control-name="connect"][class="inverse-link-on-a-light-background ember-view"]`;

export default function addFriend(
  remoteDocument: HTMLDocument,
  destroy: () => void,
  leadInformation?: Lead
) {
  const openConnectPromptButton: HTMLButtonElement | null =
    remoteDocument.querySelector(openConnectPromptButtonSelector); //  prep add friend
  const observeDomMutations = curryObserveDomMutations(remoteDocument, destroy);

  if (openConnectPromptButton === null) {
    let leadFirstName;
    if (leadInformation && leadInformation.firstName)
      leadFirstName = leadInformation.firstName;
    return likelyAlreadyAddedFriend(destroy, leadFirstName);
  }
  openConnectPromptButton.click();
  return setTimeout(() => observeDomMutations()); //	next event loop cycle
}

function likelyAlreadyAddedFriend(destroy, firstName?) {
  const grammaticalIndirectObject = firstName
    ? `${firstName} was`
    : "they were";
  console.warn(
    `Couldn't find the add friend button. Perhaps ${grammaticalIndirectObject} already added as a friend?`
  );
  return destroy();
}
