import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-id";

export default function ContextMenu() {
  // 🔥 you can use this hook from everywhere. All you need is the menu id

  function handleItemClick({ event, props, triggerEvent, data }) {
    console.log(event, props, triggerEvent, data);
  }

  return (
    <div>
      <Menu id="menu-bg" theme="dark">
        <Item onClick={handleItemClick}>Add LIF</Item>
        <Item onClick={handleItemClick}>Add input train</Item>
        <Item onClick={handleItemClick}>Add random spiker</Item>
      </Menu>
      <Menu id="menu-node" theme="dark">
        <Item onClick={handleItemClick}>Delete node (DEL)</Item>
        <Item onClick={handleItemClick}>Connect node (C)</Item>
      </Menu>
    </div>
  );
}
