import React from 'react';

declare const ApplePWAPrompt: React.FC<{
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
}>;

export { ApplePWAPrompt as default };
