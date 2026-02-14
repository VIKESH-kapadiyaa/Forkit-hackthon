
const FLAVORDB_BASE = "http://192.168.1.92:9208/flavordb"
const RECIPEDB_BASE = "http://cosylab.iiitd.edu.in:6969"

Deno.serve(async (req: Request) => {
    const url = new URL(req.url)
    console.log("Incoming request:", url.pathname)

    // Check if API Key is present in environment
    const apiKey = Deno.env.get("API_KEY");
    console.log("API Key configured:", apiKey ? "YES (Length: " + apiKey.length + ")" : "NO");

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
            },
        })
    }

    // Robust path extraction:
    // Remove /functions/v1/api-proxy or /api-proxy from the start
    // This handles both local testing and deployed URL structures
    let path = url.pathname.replace(/^\/functions\/v1\/api-proxy/, "").replace(/^\/api-proxy/, "")

    // Ensure path starts with / if it's not empty, for easier matching
    if (path && !path.startsWith("/")) {
        path = "/" + path
    }

    console.log("Parsed path:", path)
    let targetUrl = ""

    // ---------- FLAVOR DB ----------
    if (path.startsWith("/flavordb")) {
        targetUrl = FLAVORDB_BASE + path.replace("/flavordb", "")
    }

    // ---------- RECIPE DB ----------
    else if (path.startsWith("/recipedb")) {
        targetUrl = RECIPEDB_BASE + path.replace("/recipedb", "")
    }

    else {
        return new Response("Invalid endpoint. Try /flavordb/... or /recipedb/...", { status: 404 })
    }

    console.log(`Proxying to: ${targetUrl}`); // DEBUG LOG

    try {
        const response = await fetch(targetUrl + url.search, {
            method: "GET",
            headers: {
                // "Authorization": Bearer ${Deno.env.get("API_KEY") ?? ""}, // FlavorDB/RecipeDB likely don't use this specific auth header, keeping it if needed but it might be causing issues if they don't expect it. The user's code had it.
                // Keeping original headers but maybe they are strict? 
                // Let's keep it simple for now as per plan, just URL update + try/catch.
                "Authorization": `Bearer ${Deno.env.get("API_KEY") ?? ""}`,
                "Content-Type": "application/json"
            }
        })

        console.log(`Upstream Response Status: ${response.status}`); // DEBUG LOG

        const data = await response.text()

        return new Response(data, {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    } catch (e) {
        console.error("Proxy error:", e)
        return new Response(JSON.stringify({ error: "Failed to fetch from upstream", details: String(e) }), {
            status: 502,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
})
