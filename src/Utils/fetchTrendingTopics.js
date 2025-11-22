import pkg from 'google-trends-api';
const googleTrends = pkg;

const trendingTopics = async () => {
    try {


        googleTrends.realTimeTrends({ geo: 'IN', category: 'all' })
            .then(res => console.log(JSON.parse(res)))
            .catch(err => console.error("Google Trends error:", err));

        const result = await googleTrends.realTimeTrends({
            geo: 'IN',
            category: 'all',
        });

        const parsed = JSON.parse(result);
        const stories = parsed.storySummaries?.trendingStories || [];

        const topics = stories
            .map((story) => story.title)
            .filter(Boolean)
            .slice(0, 10);

        const customFields = ["Job", "Study", "Fitness", "Finance"];
        return [...topics, ...customFields];
    } catch (error) {
        console.error("Error fetching real-time trends:", error);
        return ["Job", "Study", "Fitness", "Finance"];
    }
};

export { trendingTopics }
