import { trackElementClick } from "./track-element-click";
export const trackAllButtons = (
  container: HTMLElement | Document = document
): void => {
  const buttons: NodeListOf<HTMLButtonElement> =
    container.querySelectorAll("button");
  buttons.forEach((button: HTMLButtonElement): void => {
    trackElementClick(button);
  });
};
