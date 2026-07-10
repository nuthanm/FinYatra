const ICONS: Record<string, string> = {
  home: "<path d='M3 10.5 12 3l9 7.5'/><path d='M5 9.5V21h14V9.5'/><path d='M9.5 21v-6h5v6'/>",
  grid: "<rect x='3' y='3' width='7' height='7' rx='1.6'/><rect x='14' y='3' width='7' height='7' rx='1.6'/><rect x='3' y='14' width='7' height='7' rx='1.6'/><rect x='14' y='14' width='7' height='7' rx='1.6'/>",
  target: "<circle cx='12' cy='12' r='9'/><circle cx='12' cy='12' r='5'/><circle cx='12' cy='12' r='1.4'/>",
  flame: "<path d='M12 22a6 6 0 0 0 6-6c0-4-3-6.5-4.5-9C13 9 12 9.5 11.5 8.5 11 7.5 11 6 11.5 4.5 8.5 6 6 9 6 13a6 6 0 0 0 6 3z'/>",
  layers: "<path d='M12 3 2.5 8 12 13l9.5-5L12 3z'/><path d='M2.5 12.5 12 17.5l9.5-5'/><path d='M2.5 16.5 12 21.5l9.5-5'/>",
  "trending-up": "<path d='M3 17l6-6 4 4 8-8'/><path d='M16 7h5v5'/>",
  percent: "<line x1='19' y1='5' x2='5' y2='19'/><circle cx='7.5' cy='7.5' r='2.5'/><circle cx='16.5' cy='16.5' r='2.5'/>",
  box: "<path d='M21 8 12 3 3 8v8l9 5 9-5V8z'/><path d='M3 8l9 5 9-5'/><path d='M12 13v8'/>",
  card: "<rect x='2.5' y='5' width='19' height='14' rx='2.5'/><line x1='2.5' y1='10' x2='21.5' y2='10'/><line x1='6' y1='15' x2='10' y2='15'/>",
  bank: "<path d='M12 3 4 7h16l-8-4z'/><path d='M4 10h16'/><path d='M6 10v7M10 10v7M14 10v7M18 10v7'/><path d='M4 20h16'/>",
  clock: "<circle cx='12' cy='12' r='9'/><path d='M12 7.5v5l3.5 2'/>",
  refresh: "<path d='M21 12a9 9 0 1 1-2.6-6.4'/><path d='M21 4v4.5h-4.5'/>",
  search: "<circle cx='11' cy='11' r='7'/><line x1='21' y1='21' x2='16.6' y2='16.6'/>",
  menu: "<line x1='4' y1='7' x2='20' y2='7'/><line x1='4' y1='12' x2='20' y2='12'/><line x1='4' y1='17' x2='20' y2='17'/>",
  "chevron-left": "<path d='M15 5l-7 7 7 7'/>",
  "chevron-right": "<path d='M9 5l7 7-7 7'/>",
  "chevron-up": "<path d='M6 14l6-6 6 6'/>",
  "chevron-down": "<path d='M6 10l6 6 6-6'/>",
  list: "<line x1='8' y1='6' x2='21' y2='6'/><line x1='8' y1='12' x2='21' y2='12'/><line x1='8' y1='18' x2='21' y2='18'/><circle cx='3.5' cy='6' r='1'/><circle cx='3.5' cy='12' r='1'/><circle cx='3.5' cy='18' r='1'/>",
  mail: "<rect x='3' y='6' width='18' height='14' rx='2.5'/><path d='M3 8l9 6 9-6'/>",
  check: "<path d='M4 12.5l5 5L20 6.5'/>",
  image: "<rect x='3' y='4' width='18' height='16' rx='2.5'/><circle cx='8.5' cy='9.5' r='1.8'/><path d='M4 18l5-4 3.5 2.5L17 12l3 4'/>",
  shield: "<path d='M12 3 5 6v5c0 4.6 3 7.6 7 9 4-1.4 7-4.4 7-9V6l-7-3z'/>",
  file: "<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z'/><path d='M14 3v5h5'/><line x1='8.5' y1='13' x2='15.5' y2='13'/><line x1='8.5' y1='17' x2='13.5' y2='17'/>",
  copy: "<rect x='9' y='9' width='11' height='11' rx='2'/><path d='M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2'/>",
  compass: "<circle cx='12' cy='12' r='9'/><path d='M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5z'/>",
  sparkle: "<path d='M12 3l1.8 4.9L18.7 9.7 13.8 11.5 12 16.4 10.2 11.5 5.3 9.7 10.2 7.9 12 3z'/>",
  landmark: "<path d='M12 3 4 7h16l-8-4z'/><path d='M6 10v7M10 10v7M14 10v7M18 10v7'/><path d='M4 20h16'/><path d='M4 10h16'/>",
  briefcase: "<rect x='3' y='7' width='18' height='13' rx='2'/><path d='M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7'/><path d='M3 12h18'/>",
  heart: "<path d='M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10.5c0 5.4-7 10-7 10z' fill='currentColor' stroke='none'/>",
  globe: "<circle cx='12' cy='12' r='9'/><path d='M3 12h18'/><path d='M12 3a14 14 0 0 1 0 18'/><path d='M12 3a14 14 0 0 0 0 18'/>",
};

type Props = { name: string; size?: number; className?: string };

export function FyIcon({ name, size = 20, className }: Props) {
  const inner = ICONS[name] ?? "";
  return (
    <svg
      className={`fy-ic${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
