export async function apiRequest(url: string, method: string = "GET", body: any = null) {
  try {
    // Define the options for the request
    const options: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);

    // Send the request
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    // Return the response as JSON
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);

    // Catch the error and alert the user
    if (error instanceof Error) {
      alert(`An error occurred: ${error.message}`);
    } else {
      alert('An unexpected error occurred');
    }
  }
}
