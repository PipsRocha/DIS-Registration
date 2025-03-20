import axios from "axios";

export async function GET({ url }) {
    const clientNo = url.searchParams.get("clientNo");
    
  
    if (!clientNo) {
        return new Response(JSON.stringify({ error: "Missing memberNo" }), { status: 400 });
    }
  
    const apiUrl = `https://cfapi.acm.org/rest/confRegistration/confRegistration/026/${clientNo}`;
  
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
  
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  