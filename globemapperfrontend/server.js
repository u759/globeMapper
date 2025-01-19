const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();

// ✅ Enable CORS so frontend can access backend
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ Serve static files (for production)
app.use(express.static(path.join(__dirname, "build")));

// ✅ API Endpoint to Scrape Image on Hover
app.get("/get-image", async (req, res) => {
    const newsUrl = req.query.url;
    if (!newsUrl) return res.json({ error: "No URL provided" });

    try {
        console.log(`🔎 Scraping: ${newsUrl}`);
        const { data } = await axios.get(newsUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        const $ = cheerio.load(data);

        // Look for Open Graph image
        let image = $('meta[property="og:image"]').attr("content");

        // Look for Twitter Card image if no OG image
        if (!image) image = $('meta[property="twitter:image"]').attr("content");

        // If no meta tags, find first <img> in <article>
        if (!image) image = $("article img").attr("src");

        console.log(`✅ Found Image: ${image || "No image found"}`);
        res.json({ imageUrl: image || "No image found" });
    } catch (error) {
        console.error("Scraping error:", error);
        res.json({ imageUrl: "No image found" });
    }
});

// ✅ Serve React frontend (for deployment)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ Start server on port 8080 (or another port)
const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Backend running inside frontend on http://localhost:${PORT}`));
