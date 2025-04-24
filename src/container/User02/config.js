const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export async function createUser(data) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}


