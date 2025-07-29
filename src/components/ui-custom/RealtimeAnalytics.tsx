import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Clock, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalVisits: number;
  activeUsers: number;
  todayVisits: number;
  avgSessionTime: string;
  recentActivity: Array<{
    id: string;
    event_type: string;
    created_at: string;
    page_url?: string;
  }>;
}

export const RealtimeAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    activeUsers: 0,
    todayVisits: 0,
    avgSessionTime: '0m',
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track page visit
    trackPageVisit();
    
    // Load initial analytics
    loadAnalytics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics'
        },
        (payload) => {
          console.log('Analytics update:', payload);
          loadAnalytics(); // Refresh analytics on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const trackPageVisit = async () => {
    try {
      const sessionId = getOrCreateSessionId();
      await supabase.from('analytics').insert({
        event_type: 'page_visit',
        event_data: {
          page: 'home',
          timestamp: new Date().toISOString()
        },
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  };

  const getOrCreateSessionId = (): string => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Get total visits
      const { count: totalVisits } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true });

      // Get today's visits
      const today = new Date().toISOString().split('T')[0];
      const { count: todayVisits } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Get active users (unique sessions in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: activeSessions } = await supabase
        .from('analytics')
        .select('session_id')
        .gte('created_at', oneHourAgo);

      const activeUsers = new Set(activeSessions?.map(s => s.session_id) || []).size;

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('analytics')
        .select('id, event_type, created_at, page_url')
        .order('created_at', { ascending: false })
        .limit(5);

      setAnalytics({
        totalVisits: totalVisits || 0,
        activeUsers,
        todayVisits: todayVisits || 0,
        avgSessionTime: '2m 30s', // Simulated for demo
        recentActivity: recentActivity || []
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Visits */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Visits</CardTitle>
          <Eye className="h-4 w-4 text-mindwell-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 animate-scale-in">
            {isLoading ? '...' : analytics.totalVisits.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">All time visits</p>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 animate-scale-in">
            {isLoading ? '...' : analytics.activeUsers}
            <Badge variant="secondary" className="ml-2 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">In the last hour</p>
        </CardContent>
      </Card>

      {/* Today's Visits */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Today's Visits</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 animate-scale-in">
            {isLoading ? '...' : analytics.todayVisits}
          </div>
          <p className="text-xs text-slate-500 mt-1">Visits today</p>
        </CardContent>
      </Card>

      {/* Avg Session Time */}
      <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Avg Session</CardTitle>
          <Clock className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 animate-scale-in">
            {analytics.avgSessionTime}
          </div>
          <p className="text-xs text-slate-500 mt-1">Average duration</p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2 lg:col-span-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2 text-mindwell-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium capitalize">
                    {activity.event_type.replace('_', ' ')}
                  </span>
                  {activity.page_url && (
                    <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                      {new URL(activity.page_url).pathname}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {formatTimeAgo(activity.created_at)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};