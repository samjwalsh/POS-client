import { menu } from "./menu";

const getMenu = () => {
  // Add logic to attempt to get the menu from a server, and retry periodically if failed, using local menu as backup
  return menu;
};

export default getMenu;
