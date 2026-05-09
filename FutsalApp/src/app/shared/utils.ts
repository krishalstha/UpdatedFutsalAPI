// utils.ts (or inside component)
export function timeStringToMinutes(timeStr: string): number {
    // timeStr format: "HH:mm" (24-hour)
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }
  
  export function minutesToTimeString(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  