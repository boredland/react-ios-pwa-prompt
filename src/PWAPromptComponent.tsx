import type { MouseEventHandler } from "react";
import React, { useEffect, useState } from "react";
import { clsx as classNames } from "clsx";

import HomeScreenIcon from "./HomeScreenIcon";
import styles from "./PWAPromptComponent.module.css";
import ShareIcon from "./ShareIcon";

const PWAPrompt: React.FC<{
  delay: number;
  copyTitle: string;
  copyBody: string;
  copyAddHomeButtonLabel: string;
  copyShareButtonLabel: string;
  copyClosePrompt: string;
  permanentlyHideOnDismiss: boolean;
  visits: number;
  setVisits: (visits: number) => void;
  maxVisits: number;
  onClose?: (
    event:
      | Parameters<MouseEventHandler<HTMLDivElement>>[0]
      | Parameters<MouseEventHandler<HTMLButtonElement>>[0]
  ) => void;
}> = ({
  delay,
  copyTitle,
  copyBody,
  copyAddHomeButtonLabel,
  copyShareButtonLabel,
  copyClosePrompt,
  permanentlyHideOnDismiss,
  visits,
  setVisits,
  maxVisits,
  onClose,
}) => {
  const [isVisible, setVisibility] = useState(!Boolean(delay));

  useEffect(() => {
    if (delay) {
      setTimeout(() => {
        // Prevent keyboard appearing over the prompt if a text input has autofocus set
        if (document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }

        setVisibility(true);
      }, delay);
    }
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.body.classList.add(styles.noScroll!);
    }
  }, [isVisible, setVisits, visits]);

  const isiOS13AndUp = /OS (13|14|15)/.test(window.navigator.userAgent);
  const visibilityClass = isVisible ? styles.visible : styles.hidden;
  const iOSClass = isiOS13AndUp ? styles.modern : "legacy";

  const dismissPrompt = (
    event:
      | Parameters<MouseEventHandler<HTMLDivElement>>[0]
      | Parameters<MouseEventHandler<HTMLButtonElement>>[0]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.body.classList.remove(styles.noScroll!);
    setVisibility(false);

    if (permanentlyHideOnDismiss) {
      setVisits(maxVisits);
    }

    if (onClose) {
      onClose(event);
    }
  };

  const onTransitionOut: React.TransitionEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (!isVisible) {
      event.currentTarget.style.display = "none";
    }
    setVisits(visits + 1);
  };

  return (
    <>
      <div
        className={classNames(
          styles.pwaPromptOverlay,
          visibilityClass,
          iOSClass
        )}
        aria-label="Close"
        role="button"
        onClick={dismissPrompt}
        onTransitionEnd={onTransitionOut}
      />
      <div
        className={classNames(styles.pwaPrompt, visibilityClass, iOSClass)}
        aria-describedby="pwa-prompt-description"
        aria-labelledby="pwa-prompt-title"
        role="dialog"
        onTransitionEnd={onTransitionOut}
      >
        <div className={styles.pwaPromptHeader}>
          <p id="pwa-prompt-title" className={styles.pwaPromptTitle}>
            {copyTitle}
          </p>
          <button className={styles.pwaPromptCancel} onClick={dismissPrompt}>
            {copyClosePrompt}
          </button>
        </div>
        <div className={styles.pwaPromptBody}>
          <div className={styles.pwaPromptDescription}>
            <p id="pwa-prompt-description" className={styles.pwaPromptCopy}>
              {copyBody}
            </p>
          </div>
        </div>
        <div className={styles.pwaPromptInstruction}>
          <div className={styles.pwaPromptInstructionStep}>
            <ShareIcon modern={isiOS13AndUp} />
            <p className={classNames(styles.pwaPromptCopy, styles.bold)}>
              {copyShareButtonLabel}
            </p>
          </div>
          <div className={styles.pwaPromptInstructionStep}>
            <HomeScreenIcon modern={isiOS13AndUp} />
            <p className={classNames(styles.pwaPromptCopy, styles.bold)}>
              {copyAddHomeButtonLabel}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAPrompt;
