const config = {
  //		attributeFilter: false, //  An array of specific attribute names to be monitored. If this property isn't included, changes to all attributes cause mutation notifications. No default value.
  attributeOldValue: true, //  Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes; see Monitoring attribute values in MutationObserver for details on watching for attribute changes and value recording. No default value.
  attributes: true, //  Set to true to watch for changes to the value of attributes on the node or nodes being monitored. The default value is false.
  characterData: true, //  Set to true to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. No default value.
  characterDataOldValue: true, //  Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored. For details and an example, see Monitoring text content changes in MutationObserver. No default value.
  childList: true, //  Set to true to monitor the target node (and, if subtree is true, its descendants) for the addition of new child nodes or removal of existing child nodes. The default is false.
  subtree: true, //  Set to true to extend monitoring to the entire subtree of nodes rooted at target. All of the other MutationObserverInit properties are then extended to all of the nodes in the subtree instead of applying solely to the target node. The default value is false.
};

export default function curryObserveDomMutations(
  remoteDocument: HTMLDocument,
  destroy: () => void
) {
  return function observeDomMutations() {
    const targetNode = remoteDocument;
    let SUBMITTED = false;
    const observer = new MutationObserver(mutationObserverCallback);

    return observer.observe(targetNode, config);

    function mutationObserverCallback(
      allMutations: MutationRecord[],
      observer: any
    ) {
      const finalConnectButton: HTMLButtonElement | null =
        remoteDocument.querySelector(
          `button[class="button-primary-medium connect-cta-form__send" ][type="button"]`
        );

      if (finalConnectButton === null) {
        if (SUBMITTED === false) {
          return first(allMutations); //	1
        }
        return fourth(allMutations, destroy, observer); //	4
      }
      if (SUBMITTED === true) {
        return second(allMutations); //	2
      }
      return (SUBMITTED = third(finalConnectButton, SUBMITTED)); //	3
    }
  };
}

/**
 * Waiting for the final connect button to render.
 * @param mutationsList
 *
 * finalConnectButton = null
 * SUBMITTED = false
 *
 */
function first(mutationsList: any) {
  console.log(`[1/5] Waiting for final connect button to render...`);
}

/**
 * Final connect button has been rendered.
 * @param msgAboutConnectButton
 * @param mutationsList
 *
 * finalConnectButton = HTMLElement
 * SUBMITTED = true
 *
 */

function second(mutationsList: any) {
  console.log(`[2/5] Final connect button rendered!`);
}

/**
 * Click the final connect button.
 * @param finalConnectButton
 * @param SUBMITTED
 *
 * finalConnectButton = HTMLElement
 * SUBMITTED = false
 *
 */
function third(finalConnectButton: HTMLButtonElement, SUBMITTED: boolean) {
  finalConnectButton.click();
  console.log(`[3/5] Sent out friend request.`);
  SUBMITTED = true;
  return SUBMITTED;
}

/**
 * Verify that the connection was sent.
 * Destroy iframe on confirmation.
 *
 * finalConnectButton = null
 * SUBMITTED = true
 *
 */
function fourth(
  mutationsList: MutationRecord[],
  destroy: () => void,
  observer: any
) {
  console.log(`[4/5] Pending friend request response...`);
  if (mutationsList.length === 1) {
    const selfDestruct = fifth(mutationsList);

    if (selfDestruct) {
      //	Return self destruct true if friend request recieved by server.
      observer.disconnect();
      return destroy();
    }
  }
}

/**
 * The final one, with the toaster popup saying successfully sent friend request.
 * This means that the friend request attempt was successfully recieved by the server.
 * @param mutationsList
 */
function fifth(mutationsList: MutationRecord[]) {
  const record = mutationsList[0];
  if (record.attributeName == "class" && record.type == "attributes") {
    const target = record.target as HTMLElement;
    if (target?.tagName == "DIV" && target?.className.includes("success")) {
      console.log(`[5/5] Friend request complete.`);
      return true;
    }
  }
}
