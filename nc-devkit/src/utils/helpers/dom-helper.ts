/**
 * Hide on Click outside
 * @param element Dom element
 * @param callback Function that will be called when click outside
 */
export const hideOnClickOutside = (element, callback) => {
  const containerOutsideClickListener = (event) => {
    if (!element.isSameNode(event.target) && !element.contains(event.target))
      onClickOutside();
  };
  const onClickOutside = () => {
    callback(false);
    window.removeEventListener('click', containerOutsideClickListener);
    window.removeEventListener('touch', containerOutsideClickListener);
  };
  window.addEventListener('click', containerOutsideClickListener);
  window.addEventListener('touch', containerOutsideClickListener);
};
