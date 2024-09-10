export async function mainModule() {
  console.log(`Hello from mainModule`);
}

const testEmptyString = ""
const testEmptyStrings = ''

mainModule()
  .then(() => {
    console.log("mainModule loaded");
  })
  .catch((error) => {
    console.error(error);
  });
