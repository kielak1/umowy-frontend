// lib/fetchWithAuth.ts

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const accessToken = sessionStorage.getItem("access_token");
  
    const authInit: RequestInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    let response = await fetch(input, authInit);
  
    if (response.status === 401) {
      console.warn("🔁 Access token wygasł, próbuję odświeżyć...");
  
      const refreshResponse = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        credentials: "include", // żeby wysłać HttpOnly cookie
      });
  
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.access;
  
        if (newAccessToken) {
          sessionStorage.setItem("access_token", newAccessToken);
  
          // powtórz pierwotne zapytanie z nowym tokenem
          const retryInit: RequestInit = {
            ...init,
            headers: {
              ...(init?.headers || {}),
              Authorization: `Bearer ${newAccessToken}`,
            },
          };
  
          response = await fetch(input, retryInit);
        }
      } else {
        console.error("❌ Nie udało się odświeżyć tokena – redirect do logowania?");
        // tutaj można np. czyścić sesję i redirectować
      }
    }
  
    return response;
  }
  