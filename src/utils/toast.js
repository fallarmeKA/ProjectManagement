import { Slide, toast } from "react-toastify";

const options = {
  position: "bottom-left",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

export const notify = {
  /**
   *
   * @param {string} text
   * @returns
   */
  info: (text) => toast.info(text, options),

  /**
   *
   * @param {string} text
   * @returns
   */
  success: (text) => toast.success(text, options),

  /**
   *
   * @param {string} text
   * @returns
   */
  warning: (text) => toast.warning(text, options),

  /**
   *
   * @param {string} text
   * @returns
   */
  error: (text) => toast.error(text, options),

  /**
   *
   * @param {string} text
   * @returns
   */
  show: (text) => toast(text, options),
};
