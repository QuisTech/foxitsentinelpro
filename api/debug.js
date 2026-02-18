export default function handler(req, res) {
  res.status(200).json({
    message: "Plain JS Debug",
    time: new Date().toISOString()
  });
}
