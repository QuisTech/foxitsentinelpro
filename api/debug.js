export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    message: "Plain JS Debug",
    time: new Date().toISOString()
  }));
}
