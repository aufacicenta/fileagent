import clsx from "clsx";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { ToastContextController } from "context/toast/ToastContextController";
import { LocaleSelector } from "ui/locale-selector/LocaleSelector";
import { FileContextController } from "context/file/FileContextController";
import { MessageContextController } from "context/message/MessageContextController";
import { FormContextController } from "context/form/FormContextController";
import { Navbar } from "ui/fileagent/navbar/Navbar";
import { AuthorizationContextController } from "context/authorization/AuthorizationContextController";

import { ChatLayoutProps } from "./ChatLayout.types";
import styles from "./ChatLayout.module.scss";

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const { locale } = useRouter();

  useEffect(() => {
    document.body.dataset.theme = "fileagent";
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta property="og:image" content="/shared/pulse.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
      </Head>
      <MessageContextController>
        <FileContextController>
          <FormContextController>
            <ToastContextController>
              <AuthorizationContextController>
                <div id="modal-root" />
                <div id="dropdown-portal" />
                <div className={clsx(styles["chat-layout"])}>
                  <Navbar />

                  <LocaleSelector />

                  <MainPanel>{children}</MainPanel>
                </div>
              </AuthorizationContextController>
            </ToastContextController>
          </FormContextController>
        </FileContextController>
      </MessageContextController>
    </>
  );
};
