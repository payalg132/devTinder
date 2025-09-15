const ngrok = require("@ngrok/ngrok");

const start = async () => {
  const listener = await ngrok.connect({ addr: 3000 });
  console.log("🚀 ngrok tunnel running at:", listener.url());
};

start();
