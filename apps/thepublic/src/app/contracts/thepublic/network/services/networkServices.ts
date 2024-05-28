// networkServices.ts
export const startNmapScan = async (target: string): Promise<string> => {
  const response = await fetch('http://localhost:3001/start-scan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target }),
  });

  if (!response.ok) {
    throw new Error('Failed to start Nmap scan');
  }

  const data = await response.json();
  return data.output;
};