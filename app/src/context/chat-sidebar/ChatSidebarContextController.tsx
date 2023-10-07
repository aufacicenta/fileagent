import React, { useState } from "react";

import { ChatSidebarContext } from "./ChatSidebarContext";
import { ChatSidebarContextControllerProps } from "./ChatSidebarContext.types";

export const ChatSidebarContextController = ({ children }: ChatSidebarContextControllerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const props = {
    isOpen,
    toggle,
  };

  return <ChatSidebarContext.Provider value={props}>{children}</ChatSidebarContext.Provider>;
};
