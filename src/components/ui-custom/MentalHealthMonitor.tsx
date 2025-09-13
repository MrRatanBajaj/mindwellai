import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { Heart, Brain, Zap, Moon, Smile, TrendingUp, AlertCircle, CheckCircle, Activity, BarChart3, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  notes: string;
  tags: string[];
}

interface MentalHealthMonitorProps {
  className?: string;
}

const MentalHealthMonitor = ({ className }: MentalHealthMonitorProps) => {
  const [currentMood, setCurrentMood] = useState<number[]>([5]);
  const [currentEnergy, setCurrentEnergy] = useState<number[]>([5]);
  const [currentStress, setCurrentStress] = useState<number[]>([5]);
  const [currentSleep, setCurrentSleep] = useState<number[]>([7]);
  const [notes, setNotes] = useState("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showQuickCheck, setShowQuickCheck] = useState(true);

  useEffect(() => {
    // Load saved mood entries from localStorage
    const savedEntries = localStorage.getItem('mentalHealthEntries');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: currentMood[0],
      energy: currentEnergy[0],
      stress: currentStress[0],
      sleep: currentSleep[0],
      notes,
      tags: generateTags()
    };

    const updatedEntries = [newEntry, ...moodEntries].slice(0, 30); // Keep last 30 entries
    setMoodEntries(updatedEntries);
    localStorage.setItem('mentalHealthEntries', JSON.stringify(updatedEntries));
    
    setNotes("");
    setShowQuickCheck(false);
    toast.success("Mental health check-in saved successfully!");
  };

  const generateTags = () => {
    const tags: string[] = [];
    
    if (currentMood[0] >= 8) tags.push("positive");
    else if (currentMood[0] <= 3) tags.push("low-mood");
    
    if (currentEnergy[0] >= 8) tags.push("energetic");
    else if (currentEnergy[0] <= 3) tags.push("tired");
    
    if (currentStress[0] >= 7) tags.push("stressed");
    else if (currentStress[0] <= 3) tags.push("relaxed");
    
    if (currentSleep[0] >= 8) tags.push("well-rested");
    else if (currentSleep[0] <= 5) tags.push("sleep-deprived");
    
    return tags;
  };

  const getAverageScore = (type: keyof Pick<MoodEntry, 'mood' | 'energy' | 'stress' | 'sleep'>) => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.slice(0, 7).reduce((acc, entry) => acc + entry[type], 0);
    return Math.round((sum / Math.min(moodEntries.length, 7)) * 10) / 10;
  };

  const getInsights = () => {
    const insights = [];
    const weekAvg = {
      mood: getAverageScore('mood'),
      energy: getAverageScore('energy'),
      stress: getAverageScore('stress'),
      sleep: getAverageScore('sleep')
    };

    if (weekAvg.mood >= 7) {
      insights.push({ type: 'positive', message: 'Your mood has been consistently positive this week!' });
    } else if (weekAvg.mood <= 4) {
      insights.push({ type: 'concern', message: 'Your mood seems low lately. Consider reaching out for support.' });
    }

    if (weekAvg.stress >= 7) {
      insights.push({ type: 'warning', message: 'High stress levels detected. Try some relaxation exercises.' });
    }

    if (weekAvg.sleep <= 6) {
      insights.push({ type: 'warning', message: 'Sleep quality seems low. Focus on sleep hygiene.' });
    }

    if (weekAvg.energy >= 7 && weekAvg.mood >= 7) {
      insights.push({ type: 'positive', message: 'Great energy and mood combo! Keep up the good work.' });
    }

    return insights;
  };

  const getMoodColor = (value: number) => {
    if (value >= 8) return "bg-green-500";
    if (value >= 6) return "bg-yellow-500";
    if (value >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 9) return "😊";
    if (value >= 7) return "🙂";
    if (value >= 5) return "😐";
    if (value >= 3) return "😔";
    return "😞";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Mental Health Self-Awareness</h2>
        <p className="text-muted-foreground">Track your daily mental wellness and gain insights</p>
      </div>

      {/* Quick Daily Check-in */}
      {showQuickCheck && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Daily Mental Health Check-in
              </CardTitle>
              <CardDescription>
                Take a moment to reflect on how you're feeling today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Smile className="w-4 h-4" />
                      Mood {getMoodEmoji(currentMood[0])}
                    </label>
                    <span className="text-sm text-muted-foreground">{currentMood[0]}/10</span>
                  </div>
                  <Slider
                    value={currentMood}
                    onValueChange={setCurrentMood}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Energy Level
                    </label>
                    <span className="text-sm text-muted-foreground">{currentEnergy[0]}/10</span>
                  </div>
                  <Slider
                    value={currentEnergy}
                    onValueChange={setCurrentEnergy}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Stress Level
                    </label>
                    <span className="text-sm text-muted-foreground">{currentStress[0]}/10</span>
                  </div>
                  <Slider
                    value={currentStress}
                    onValueChange={setCurrentStress}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Sleep Quality (last night)
                    </label>
                    <span className="text-sm text-muted-foreground">{currentSleep[0]}/10</span>
                  </div>
                  <Slider
                    value={currentSleep}
                    onValueChange={setCurrentSleep}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Additional Notes (Optional)</label>
                  <Textarea
                    placeholder="How are you feeling today? Any specific thoughts or events affecting your mood?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <Button onClick={saveMoodEntry} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Check-in
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weekly Overview */}
      {moodEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Weekly Overview
              </CardTitle>
              <CardDescription>
                Your mental health trends over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">{getAverageScore('mood')}</div>
                  <div className="text-sm text-muted-foreground">Avg Mood</div>
                  <Progress value={getAverageScore('mood') * 10} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{getAverageScore('energy')}</div>
                  <div className="text-sm text-muted-foreground">Avg Energy</div>
                  <Progress value={getAverageScore('energy') * 10} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{getAverageScore('stress')}</div>
                  <div className="text-sm text-muted-foreground">Avg Stress</div>
                  <Progress value={getAverageScore('stress') * 10} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{getAverageScore('sleep')}</div>
                  <div className="text-sm text-muted-foreground">Avg Sleep</div>
                  <Progress value={getAverageScore('sleep') * 10} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Insights & Recommendations */}
      {moodEntries.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getInsights().map((insight, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      insight.type === 'positive' ? 'bg-green-50 border border-green-200' :
                      insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}
                  >
                    {insight.type === 'positive' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : insight.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <span className="text-sm">{insight.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        <div className="flex gap-1">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`}></span>
                      <span>{entry.mood}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!showQuickCheck && moodEntries.length > 0 && (
        <Button
          variant="outline"
          onClick={() => setShowQuickCheck(true)}
          className="w-full"
        >
          <Activity className="w-4 h-4 mr-2" />
          New Check-in
        </Button>
      )}
    </div>
  );
};

export default MentalHealthMonitor;