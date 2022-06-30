import React,{useEffect,useMemo,useState} from "react";

import PWAPrompt from "./components/PWAPrompt";

const deviceCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isStandalone =
    "standalone" in window.navigator && window.navigator.standalone;

  return (isiOS || isiPadOS) && !isStandalone;
};

export default ({
  timesToShow = 1,
  promptOnVisit = 1,
  permanentlyHideOnDismiss = true,
  copyTitle = "Add to Home Screen",
  copyBody = "This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.",
  copyShareButtonLabel = "1) Press the 'Share' button on the menu bar below.",
  copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'.",
  copyClosePrompt = "Cancel",
  delay = 1000,
  debug = false,
  onClose = () => {},
}) => {
  const getPromptData=()=>{
    let data=JSON.parse(localStorage.getItem("iosPwaPrompt"));
    if(!data){
      data = { isiOS: deviceCheck(), visits: 0 };
      localStorage.setItem("iosPwaPrompt", JSON.stringify(data));
    }
    return data;
  }

  const [promptData, setPromptData] = useState(getPromptData());

  
  const aboveMinVisits = useMemo(() => promptData.visits + 1 >= promptOnVisit, [promptData?.visits]);
  const belowMaxVisits = useMemo(() => promptData.visits + 1 < promptOnVisit + timesToShow, [promptData?.visits]);

  useEffect(()=>{
    if ((belowMaxVisits || debug) && promptData) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          visits: promptData.visits + 1,
        })
      );
    }
  }, [belowMaxVisits, promptData])

  if ((promptData.isiOS && belowMaxVisits && aboveMinVisits) || debug) {
    
    return (
      <PWAPrompt
        delay={delay}
        copyTitle={copyTitle}
        copyBody={copyBody}
        copyAddHomeButtonLabel={copyAddHomeButtonLabel}
        copyShareButtonLabel={copyShareButtonLabel}
        copyClosePrompt={copyClosePrompt}
        permanentlyHideOnDismiss={permanentlyHideOnDismiss}
        promptData={promptData}
        maxVisits={timesToShow + promptOnVisit}
        onClose={onClose}
      />
    );
  }

  return null;
};
