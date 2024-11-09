export const convertToLocaleTime = (
  date: number | undefined,
  timeZone: string = ""
): {
  dateString: string;
  localeTime: string;
  day: string;
  actualTime: string;
} => {
  if (!date)
    return {
      dateString: "",
      localeTime: "",
      day: "",
      actualTime: "",
    };

  const data = new Date(date * 1000);

  const dateString = data.toDateString();
  const time = data.toLocaleTimeString("en-US");

  const localeTime = data.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone || undefined,
    timeZoneName: "shortGeneric",
  });

  const actualTime = data.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,

    timeZoneName: "shortGeneric",
  });

  const day = data.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return {
    dateString,
    localeTime,
    day,
    actualTime,
  };
};

export const getCurrentHour = (
  date: number | undefined,
  timeZone: string = ""
): number => {
  if (!date) return 1;
  const data = new Date(date * 1000);

  const localHour = data.toLocaleTimeString([], {
    hour: "2-digit",
    hour12: false,
    timeZone: timeZone || undefined,
  });
  return Number(localHour);
};
