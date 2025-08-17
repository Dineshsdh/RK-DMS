// api.js - add fetchSweets for sweet name/rate automation
export async function fetchSweets() {
  const res = await fetch('http://localhost:5000/api/sweets');
  if (!res.ok) throw new Error('Failed to fetch sweets');
  return res.json();
}
// ...existing code...
