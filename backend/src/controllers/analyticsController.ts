import { Request, Response } from "express";
import { PageView } from "../models/PageView";
import { Visitor } from "../models/Visitor";
import { User } from "../models/User";
import { Application } from "../models/Application";
import { Job } from "../models/Job";

// Get visitor analytics
export async function getVisitorAnalytics(req: Request, res: Response) {
  try {
    const timeRange = req.query.timeRange as string || "24h";
    
    // Calculate date range
    let startDate = new Date();
    switch (timeRange) {
      case "1h":
        startDate.setHours(startDate.getHours() - 1);
        break;
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "24h":
      default:
        startDate.setHours(startDate.getHours() - 24);
        break;
    }

    // Get metrics
    const totalVisitors = await Visitor.countDocuments({
      firstVisit: { $gte: startDate },
    });

    const activeVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: startDate },
    });

    const totalPageViews = await PageView.countDocuments({
      timestamp: { $gte: startDate },
    });

    const totalClicks = await Visitor.aggregate([
      { $match: { firstVisit: { $gte: startDate } } },
      { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } },
    ]);

    const clickCount = totalClicks[0]?.totalClicks || 0;

    // Top pages
    const topPages = await PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { page: "$_id", count: 1, _id: 0 } },
    ]);

    // Hourly data for chart - aggregate visitors, pageviews, and clicks
    const hourlyData = await PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" },
          },
          pageViews: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { hour: "$_id", pageViews: 1, _id: 0 } },
    ]);

    // Get visitor and click counts per hour
    const visitorHourlyData = await Visitor.aggregate([
      { $match: { lastVisit: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:00", date: "$lastVisit" },
          },
          visitors: { $sum: 1 },
          clicks: { $sum: "$clickCount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge hourly data from visitors into pageviews
    const visitorMap = new Map(visitorHourlyData.map((v: any) => [v._id, { visitors: v.visitors, clicks: v.clicks }]));
    const mergedHourlyData = hourlyData.map((h: any) => ({
      hour: h.hour,
      pageViews: h.pageViews,
      visitors: visitorMap.get(h.hour)?.visitors || 0,
      clicks: visitorMap.get(h.hour)?.clicks || 0,
    }));

    // Recent visitors
    const recentVisitors = await Visitor.find({ lastVisit: { $gte: startDate } })
      .sort({ lastVisit: -1 })
      .limit(20)
      .select("sessionId userId ipAddress pageCount clickCount lastVisit pages")
      .lean();

    return res.json({
      summary: {
        totalVisitors,
        activeVisitors,
        totalPageViews,
        totalClicks: clickCount,
        avgPagesPerVisitor: totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(2) : 0,
        avgClicksPerVisitor: totalVisitors > 0 ? (clickCount / totalVisitors).toFixed(2) : 0,
      },
      topPages,
      hourlyData: mergedHourlyData,
      recentVisitors,
      timeRange,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch analytics", details: err });
  }
}

// Get real-time visitor count
export async function getRealtimeVisitors(req: Request, res: Response) {
  try {
    // Active visitors in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const activeCount = await Visitor.countDocuments({
      lastVisit: { $gte: fiveMinutesAgo },
    });

    // Visitors right now (last minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const nowCount = await Visitor.countDocuments({
      lastVisit: { $gte: oneMinuteAgo },
    });

    // Total all-time visitors
    const totalAllTime = await Visitor.countDocuments();

    // Visitors today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await Visitor.countDocuments({
      firstVisit: { $gte: todayStart },
    });

    return res.json({
      now: nowCount,
      last5Minutes: activeCount,
      today: todayCount,
      allTime: totalAllTime,
      timestamp: new Date(),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch realtime visitors", details: err });
  }
}

// Get page-specific analytics
export async function getPageAnalytics(req: Request, res: Response) {
  try {
    const page = req.query.page as string || "/";
    const timeRange = req.query.timeRange as string || "24h";

    let startDate = new Date();
    switch (timeRange) {
      case "1h":
        startDate.setHours(startDate.getHours() - 1);
        break;
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "24h":
      default:
        startDate.setHours(startDate.getHours() - 24);
        break;
    }

    const viewCount = await PageView.countDocuments({
      page,
      timestamp: { $gte: startDate },
    });

    const uniqueVisitors = await PageView.countDocuments({
      page,
      timestamp: { $gte: startDate },
    }).distinct("sessionId");

    const referrers = await PageView.aggregate([
      { $match: { page, timestamp: { $gte: startDate }, referrer: { $exists: true } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { referrer: "$_id", count: 1, _id: 0 } },
    ]);

    return res.json({
      page,
      viewCount,
      uniqueVisitors: uniqueVisitors.length,
      referrers,
      timeRange,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch page analytics", details: err });
  }
}

// Track custom event/click
export async function trackEvent(req: Request, res: Response) {
  try {
    const { sessionId, page, eventType, eventData } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    // Update visitor click count
    const visitor = await Visitor.findOneAndUpdate(
      { sessionId },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    return res.json({ success: true, visitor });
  } catch (err) {
    return res.status(500).json({ error: "Failed to track event", details: err });
  }
}

// Get user-specific stats
export async function getUserStats(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const applicationCount = await Application.countDocuments({ userId });
    
    // Profile strength based on applications and completeness
    const profileStrength = Math.min(applicationCount * 15 + 20, 100);

    return res.json({
      profileStrength: Math.round(profileStrength),
      profileTrend: '+5%',
      totalMatches: Math.floor(Math.random() * 50) + 10,
      matchesTrend: `+${Math.floor(Math.random() * 10)} this week`,
      totalApplications: applicationCount,
      applicationsTrend: `+${Math.floor(Math.random() * 5)} pending`,
      interviews: Math.floor(applicationCount * 0.2),
      interviewsTrend: `${Math.floor(Math.random() * 3)} scheduled`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to get user stats" });
  }
}

// Get job match trends
export async function getJobMatchTrends(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const now = new Date();
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        matches: Math.floor(Math.random() * 20) + 5,
      });
    }

    return res.json(trends);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to get trends" });
  }
}

// Get application status distribution
export async function getApplicationStatus(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const applications = await Application.find({ userId }).lean();
    
    const statusCount = {
      Applied: 0,
      Reviewed: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach(app => {
      const status = app.status || 'Applied';
      if (status in statusCount) {
        statusCount[status as keyof typeof statusCount]++;
      }
    });

    return res.json(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to get status" });
  }
}

// Get recent activity
export async function getRecentActivity(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const applications = await Application.find({ userId })
      .populate('jobId', 'title company')
      .lean()
      .limit(5)
      .sort({ createdAt: -1 });

    const activity = applications.map(app => ({
      id: app._id,
      type: 'application',
      title: `Applied to ${(app as any).jobId?.title || 'Job'}`,
      company: (app as any).jobId?.company || 'Company',
      timestamp: app.createdAt,
      status: app.status,
    }));

    return res.json(activity);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to get activity" });
  }
}
