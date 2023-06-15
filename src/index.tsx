/**
 * typescript clone of https://github.com/jcsofts/react-ios-pwa-prompt
 */
import { useLocalStorage } from "@mantine/hooks";
import React, { useMemo } from "react";

import PWAPromptComponent from "./PWAPromptComponent";

const isStandalone = () => {
  return "standalone" in window.navigator && window.navigator.standalone;
};

const iosQuirkPresent = () => {
  const audio = new Audio();

  audio.volume = 0.5;
  return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
};

const isiOS = () => {
  const isAppleDevice = navigator.userAgent.includes("Macintosh");
  const isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (isAppleDevice && (isTouchScreen || iosQuirkPresent()))
  );
};

const deviceCheck = () => {
  return isiOS() && !isStandalone();
};

const ApplePWAPrompt: React.FC<{
  timesToShow?: number;
  promptOnVisit?: number;
  permanentlyHideOnDismiss?: boolean;
  copyTitle?: string;
  copyBody?: string;
  copyShareButtonLabel?: string;
  copyAddHomeButtonLabel?: string;
  copyClosePrompt?: string;
  delay?: number;
  debug?: boolean;
  onClose?: () => void;
}> = ({
  timesToShow = 1,
  promptOnVisit = 1,
  permanentlyHideOnDismiss = true,
  copyTitle = "Add to Home Screen",
  copyBody = "This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.",
  copyShareButtonLabel = "1) Press the 'Share' button",
  copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'",
  copyClosePrompt = "Cancel",
  delay = 1000,
  debug = false,
  onClose,
}) => {
  const [visits, setVisits] = useLocalStorage({
    key: "pwa_visits",
    defaultValue: 0,
    getInitialValueInEffect: true,
  });

  const aboveMinVisits = useMemo(
    () => visits + 1 >= promptOnVisit,
    [visits, promptOnVisit]
  );
  const belowMaxVisits = useMemo(
    () => visits + 1 < promptOnVisit + timesToShow,
    [visits, promptOnVisit, timesToShow]
  );

  if (typeof window === "undefined") return null;

  const isiOS = deviceCheck();

  if (!isiOS && !debug) return null;

  if (belowMaxVisits && aboveMinVisits) {
    return (
      <PWAPromptComponent
        delay={delay}
        copyTitle={copyTitle}
        copyBody={copyBody}
        copyAddHomeButtonLabel={copyAddHomeButtonLabel}
        copyShareButtonLabel={copyShareButtonLabel}
        copyClosePrompt={copyClosePrompt}
        permanentlyHideOnDismiss={permanentlyHideOnDismiss}
        visits={visits}
        setVisits={setVisits}
        maxVisits={timesToShow + promptOnVisit}
        onClose={onClose}
      />
    );
  }

  return null;
};

export default ApplePWAPrompt;
