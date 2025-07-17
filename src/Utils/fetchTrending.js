
import axios from "axios";
import cron from "node-cron";


const generalTopics = [
  "finance", "study", "movie", "cricket", "fitness",
  "politics", "technology", "fashion", "startup",
  "health", "sports", "education"
];

let cachedTopics = [...generalTopics]; 

const fetchTrendingTopics = async () => {
  try {
    const { data } = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_trends",
        geo: "IN",
        data_type: "RELATED_QUERIES",
        q: "India",
        api_key: process.env.TREND_API
      }
    });

    const rawTopics = data?.related_queries?.top ?? [];
    const trendingTopics = rawTopics.map(item => item.query.toLowerCase());
    const finalTopics = Array.from(new Set([...generalTopics, ...trendingTopics]));

    cachedTopics = finalTopics; 
    

    return finalTopics;
  } catch (error) {
    console.error("Error fetching trends:", error.message);
    return cachedTopics;
  }
};


cron.schedule("0 8 * * *", () => {
  
  fetchTrendingTopics();
});

// Development
fetchTrendingTopics();

export const getCachedTopics = () => cachedTopics;
export default fetchTrendingTopics;
