// 5227
export default async function fetchUrlFromCompanyId(
  companyId: string | number
) {
  companyId = ~~companyId;
  const response = await fetch(
    `https://www.linkedin.com/sales/company/${companyId}/people`
  );
  const text = await response.text();
  const domp = new DOMParser();
  const dom = domp.parseFromString(text.toString(), "text/html");
  const codes = parseCodes(dom);
  for (const code of codes) {
    if (code && code.website) return code.website as string;
  }

  function parseCodes(dom) {
    const codes = dom.getElementsByTagName(`code`);
    let x = codes.length;
    const buffer = [];
    while (x--) {
      try {
        const code = JSON.parse(codes[x].textContent);
        buffer.push(code);
      } catch (e) {
        buffer.push(codes[x].textContent);
      }
    }
    return buffer;
  }
}
