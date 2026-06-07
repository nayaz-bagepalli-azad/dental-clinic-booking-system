import { format, addMinutes, parse } from "date-fns";

export function generateTimeSlots(
  start: string,
  end: string,
  interval = 30
) {
  const slots = [];

  let current = parse(start, "HH:mm", new Date());
  const endTime = parse(end, "HH:mm", new Date());

  while (current < endTime) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, interval);
  }

  return slots;
}