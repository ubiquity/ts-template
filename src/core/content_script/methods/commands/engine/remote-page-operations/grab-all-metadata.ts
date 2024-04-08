export default function grabAllMetadata(remoteDocument): any {
  const codes = remoteDocument.querySelectorAll(`code`);
  const statistics = [];
  const results = planA(codes, statistics);
  if (!results) return planB(statistics);
  return results;
}

/**
 *  @description This is banking on the correct `code` object of all the lead's information to have the property `location`.
 * If that fails, planB is just to grab the largest object of all the `code` elements.
 * @param codes Each `code` element in the html which apparently has parsable objects as its textContent
 * @param statistics For use in the backup plan
 */
function planA(codes, statistics) {
  let x = codes.length;

  while (x--) {
    let parsed = false;
    try {
      parsed = JSON.parse(codes[x].textContent);

      statistics.push({
        code: parsed,
        length: codes[x].textContent.trim().length,
      });
    } catch {}
    // @ts-ignore
    if (parsed.location) {
      //  I hope that this is the safest property for those "OUT OF NETOWORK" BOIZ
      return parsed;
    }
  }
}
/**
 *
 * @param statistics
 */
function planB(statistics: any[]) {
  const sorted = statistics.sort(function (a, b) {
    if (a.length > b.length) return 1;
    if (b.length > a.length) return -1;
    return 0;
  });
  return sorted.pop().code;
}
