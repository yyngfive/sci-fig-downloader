interface FigInfo {
  id: number;
  name: string;
  htmlUrl: string;
  originUrl: string;
  selected: boolean;
}

interface FiguresData {
  title: string;
  hasToc: boolean;
  hasSi: boolean;
  from: "nature" | "acs" | "wiley";
  tocFig?: FigInfo;
  mainFigs: FigInfo[];
  siFigs?: FigInfo[];
}

export { FiguresData, FigInfo };
