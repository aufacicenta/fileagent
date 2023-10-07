import clsx from "clsx";

import { useChatSidebarContext } from "context/chat-sidebar/useChatSidebarContext";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";

import { ChatSidebarProps } from "./ChatSidebar.types";
import styles from "./ChatSidebar.module.scss";

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const chatSidebarContext = useChatSidebarContext();

  return (
    <div
      className={clsx(styles["chat-sidebar"], className, {
        [styles["chat-sidebar__open"]]: chatSidebarContext.isOpen,
        [styles["chat-sidebar__closed"]]: !chatSidebarContext.isOpen,
      })}
    >
      <div className={styles["chat-sidebar__header"]}>
        <Icon
          name="icon-cross-circle"
          onClick={chatSidebarContext.toggle}
          className={styles["chat-sidebar__header--toggle"]}
        />
      </div>
      <section id="files">
        <Typography.Headline3>Files</Typography.Headline3>
        <div className={styles["chat-sidebar__file--item"]}>
          <Typography.Text flat>File 1</Typography.Text>
          <div className={styles["chat-sidebar__file--item-options"]}>
            <Typography.MiniDescription flat>
              Size — <span>Inquire</span> · <span>Download</span> · <span>Share</span> · <span>Delete</span>
            </Typography.MiniDescription>
          </div>
        </div>
      </section>
      <section id="authorizations">
        <Typography.Headline3>Authorizations</Typography.Headline3>
      </section>
    </div>
  );
};
