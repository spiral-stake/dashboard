export const corsOption = {
  origin: (origin, callback) => {
    if (
      !origin ||
      [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://app.spiralstake.xyz",
        "https://dashboard.spiralstake.xyz",
      ].includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
