
//Possible icons for services
export const ICONS_ARRAY = [
    WrenchIcon,
    WrenchScrewdriverIcon,
    BoltIcon,
    LockClosedIcon,
    WifiIcon,
    BriefcaseIcon,
    DocumentCheckIcon,
  ];

  
export const getServiceIcon = (iconNumber) => {
    switch (iconNumber) {
      case 1:
        return WrenchIcon;
      case 2:
        return BoltIcon;
      case 3:
        return WrenchScrewdriverIcon;
      case 4:
        return LockClosedIcon;
      case 5:
        return WifiIcon;
      case 6:
        return BriefcaseIcon;
      case 7:
        return DocumentCheckIcon;
      default:
        return WrenchIcon;
    }
  }