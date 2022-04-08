import { NotesIcon } from "ui/shared/icons/NotesIcon";

import { Dropdown } from "./Dropdown";

export default {
  title: "Shared/Dropdown",
  decorators: [(storyFn: () => string) => <div style={{ display: "flex" }}>{storyFn()}</div>],
};

const options = [
  <Dropdown.Item key="1">Porsche</Dropdown.Item>,
  <Dropdown.Item key="2" icon={<NotesIcon />}>
    Mercedes
  </Dropdown.Item>,
  <Dropdown.Item key="3">Ford</Dropdown.Item>,
];

export const withDefaultState = () => (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <Dropdown trigger="Click me!">{options}</Dropdown>
  </div>
);

export const withDefaultStateOpened = () => (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <Dropdown trigger="Click me!" isOpenedByDefault>
      {options}
    </Dropdown>
  </div>
);

export const bigSize = () => (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <Dropdown trigger="Click me!" size="l">
      {options}
    </Dropdown>
  </div>
);

export const bigSizeOpened = () => (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <Dropdown trigger="Click me!" size="l" isOpenedByDefault>
      {options}
    </Dropdown>
  </div>
);
