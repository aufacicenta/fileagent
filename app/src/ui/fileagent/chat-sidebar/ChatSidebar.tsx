import { useEffect, useState } from "react";
import { filesize } from "filesize";
import clsx from "clsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui/shadcn/dropdown-menu";
import { useChatSidebarContext } from "context/chat-sidebar/useChatSidebarContext";
import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";
import { ChatContextMessage } from "context/message/MessageContext.types";
import { LocalStorageKeys } from "hooks/useLocalStorage/useLocalStorage.types";
import { useMessageContext } from "context/message/useMessageContext";
import { useFileContext } from "context/file/useFileContext";
import { Button } from "ui/button/Button";
import { SheetContent } from "ui/shadcn/sheet/Sheet";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";

import { ChatSidebarProps } from "./ChatSidebar.types";
import styles from "./ChatSidebar.module.scss";

export const ChatSidebar: React.FC<ChatSidebarProps> = () => {
  const [threads, setThreads] = useState<ChatContextMessage[][]>([]);

  const authContext = useAuthorizationContext();

  const chatSidebarContext = useChatSidebarContext();

  const messageContext = useMessageContext();

  const fileContext = useFileContext();

  const ls = useLocalStorage();

  useEffect(() => {
    if (!chatSidebarContext.isOpen) {
      return;
    }

    setThreads(ls.get<ChatContextMessage[][]>(LocalStorageKeys.threads) || []);
  }, [chatSidebarContext.isOpen]);

  useEffect(() => {
    if (!chatSidebarContext.isOpen) {
      return;
    }

    fileContext.getUserFiles();
  }, [chatSidebarContext.isOpen]);

  return (
    <SheetContent side="left" className={clsx(styles["chat-sidebar"], styles["chat-sidebar__sheet-content"])}>
      <div className={styles["chat-sidebar__header"]} />
      <section id="files">
        <Typography.Headline6>
          <Icon name="icon-chevron-right" /> Files
        </Typography.Headline6>
        <div className={styles["chat-sidebar__files"]}>
          {fileContext.userFiles.map((item) => (
            <div className={styles["chat-sidebar__file--item"]} key={item.id}>
              <Typography.Description flat truncate>
                {item.name}
              </Typography.Description>
              <div className={styles["chat-sidebar__file--item-options"]}>
                <Typography.MiniDescription flat>{filesize(item.metadata.size)} </Typography.MiniDescription>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="text" size="xs" color="secondary">
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>File Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Inquire</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="authorizations">
        <Typography.Headline6>
          <Icon name="icon-chevron-right" /> Authorizations
        </Typography.Headline6>
        {authContext.authItems.map((item) => (
          <div className={styles["chat-sidebar__file--item"]} key={item.name.trim()}>
            <Typography.Description flat>{item.name}</Typography.Description>
            <div className={styles["chat-sidebar__file--item-options"]}>
              <Typography.MiniDescription flat>
                {item.isAuthorized ? "Authorized" : <span>Authorize</span>}
              </Typography.MiniDescription>
            </div>
          </div>
        ))}
      </section>
      {threads.length && (
        <section id="threads">
          <Typography.Headline6>
            <Icon name="icon-chevron-right" /> Threads
          </Typography.Headline6>
          {threads.map((item, index) => (
            <div
              className={styles["chat-sidebar__thread--item"]}
              key={item[0].id}
              onClick={() => messageContext.loadMessageThread(index)}
              role="button"
              tabIndex={0}
              onKeyPress={() => undefined}
            >
              <Typography.Description flat truncate>
                {item[1].content}
              </Typography.Description>
            </div>
          ))}
        </section>
      )}
    </SheetContent>
  );
};
