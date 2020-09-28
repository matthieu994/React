module.exports = (io) => {
  const lio = io.of("/api/TubeParty");

  lio.on("connection", (client) => {
    console.log("connection !", client);
  });
};
