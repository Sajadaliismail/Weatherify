export const fetchCordinates = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (!response.ok) throw new Error("Error getting location data");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting location data");
  }
};
