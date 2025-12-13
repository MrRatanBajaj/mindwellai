import { motion } from "framer-motion";
import { 
  Brain, Heart, Lightbulb, Target, Leaf, 
  MessageSquare, ArrowRight, CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TherapyMethodsSection = () => {
  const methods = [
    {
      icon: Brain,
      name: "Cognitive Behavioral Therapy",
      shortName: "CBT",
      description: "Identify and change negative thought patterns that affect your emotions and behavior",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      benefits: ["Reduces anxiety", "Manages depression", "Builds coping skills"],
    },
    {
      icon: Heart,
      name: "Dialectical Behavior Therapy",
      shortName: "DBT",
      description: "Learn mindfulness and emotional regulation for better relationships",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      benefits: ["Emotional balance", "Interpersonal skills", "Distress tolerance"],
    },
    {
      icon: Lightbulb,
      name: "Mindfulness-Based Therapy",
      shortName: "MBCT",
      description: "Cultivate present-moment awareness to reduce stress and prevent relapse",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      benefits: ["Stress reduction", "Self-awareness", "Mental clarity"],
    },
    {
      icon: Target,
      name: "Solution-Focused Therapy",
      shortName: "SFT",
      description: "Focus on solutions and future goals rather than dwelling on problems",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      benefits: ["Goal-oriented", "Practical solutions", "Quick results"],
    },
    {
      icon: Leaf,
      name: "Acceptance & Commitment",
      shortName: "ACT",
      description: "Accept difficult feelings while committing to values-based action",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      benefits: ["Psychological flexibility", "Values clarity", "Mindful acceptance"],
    },
    {
      icon: MessageSquare,
      name: "Person-Centered Therapy",
      shortName: "PCT",
      description: "Experience unconditional positive regard in a safe, empathetic space",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      benefits: ["Self-discovery", "Personal growth", "Non-judgmental support"],
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-0 px-4 py-1.5">
            <Brain className="w-3 h-3 mr-1" />
            Evidence-Based Approaches
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Therapy Methods That
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Actually Work</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI is trained in proven psychological techniques used by licensed therapists worldwide.
          </p>
        </motion.div>

        {/* Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <method.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <Badge className={`${method.bgColor} text-slate-700 border-0 mb-1`}>
                      {method.shortName}
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {method.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {method.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  {method.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-500">
            Our AI adapts its approach based on your needs, combining multiple techniques for personalized care.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TherapyMethodsSection;
