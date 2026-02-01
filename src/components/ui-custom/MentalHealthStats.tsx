import { motion } from "framer-motion";
import { Globe, MapPin, TrendingUp, Users, AlertTriangle, Heart } from "lucide-react";

const globalStats = [
  {
    icon: Users,
    value: "970M+",
    label: "People Affected Globally",
    description: "Living with mental health disorders worldwide",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: AlertTriangle,
    value: "1 in 4",
    label: "Will Be Affected",
    description: "People will experience mental health issues",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: TrendingUp,
    value: "25%",
    label: "Increase Since COVID",
    description: "Rise in anxiety and depression globally",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    icon: Heart,
    value: "75%",
    label: "Untreated Cases",
    description: "Don't receive adequate mental healthcare",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

const indiaStats = [
  {
    value: "150M+",
    label: "Indians Need Help",
    description: "Suffer from mental health conditions",
  },
  {
    value: "0.3",
    label: "Psychiatrists per 100K",
    description: "Severe shortage of mental health professionals",
  },
  {
    value: "80%",
    label: "Treatment Gap",
    description: "Don't have access to mental healthcare",
  },
  {
    value: "₹1.03L Cr",
    label: "Economic Impact",
    description: "Annual loss due to mental health issues",
  },
];

const MentalHealthStats = () => {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Real-Time Mental Health Data
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Mental Health Crisis
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Understanding the scale of mental health challenges helps us work together towards solutions
          </p>
        </motion.div>

        {/* Global Statistics */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-8"
          >
            <Globe className="w-5 h-5 text-violet-400" />
            <h3 className="text-xl font-semibold">Global Statistics (WHO Data)</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/90 font-medium mb-2">{stat.label}</div>
                <div className="text-slate-400 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* India Statistics */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-8"
          >
            <MapPin className="w-5 h-5 text-orange-400" />
            <h3 className="text-xl font-semibold">India Mental Health Data (NIMHANS)</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {indiaStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-white/5 to-green-500/20" />
                <div className="relative p-6 border border-white/10 rounded-2xl">
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-white/90 font-medium mb-2">{stat.label}</div>
                  <div className="text-slate-400 text-sm">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-4">
              WellMindAI is bridging this gap with accessible, 24/7 AI-powered mental health support
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Join 10,000+ users on their wellness journey</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MentalHealthStats;
