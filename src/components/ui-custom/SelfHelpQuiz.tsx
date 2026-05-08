import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, RotateCcw, Trophy } from 'lucide-react';

export interface QuizQuestion {
  q: string;
  options: { label: string; score: number }[];
}

export interface QuizDef {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  questions: QuizQuestion[];
  // Score buckets — sorted ascending by `maxScore`.
  results: { maxScore: number; level: string; advice: string }[];
}

interface Props {
  quiz: QuizDef;
}

const SelfHelpQuiz = ({ quiz }: Props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
  };

  const handleAnswer = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (step + 1 >= quiz.questions.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const total = answers.reduce((a, b) => a + b, 0);
  const result = quiz.results.find((r) => total <= r.maxScore) ?? quiz.results[quiz.results.length - 1];
  const progress = done ? 100 : (step / quiz.questions.length) * 100;

  return (
    <Card className="border-border/40 h-full">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="secondary" className="rounded-full">{quiz.category}</Badge>
          <span className="text-xs text-muted-foreground">{quiz.estimatedMinutes} min</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{quiz.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>

        {!open ? (
          <Button
            onClick={() => { reset(); setOpen(true); }}
            className="mt-auto rounded-xl bg-calm-sky text-primary-foreground hover:bg-calm-sky/90"
          >
            Take quiz
          </Button>
        ) : (
          <div className="mt-auto space-y-4">
            <Progress value={progress} className="h-1.5" />
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-muted-foreground">
                    Question {step + 1} of {quiz.questions.length}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {quiz.questions[step].q}
                  </p>
                  <div className="space-y-2">
                    {quiz.questions[step].options.map((opt) => (
                      <Button
                        key={opt.label}
                        variant="outline"
                        className="w-full justify-start rounded-xl text-left h-auto py-2.5"
                        onClick={() => handleAnswer(opt.score)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3 rounded-xl bg-muted/40 p-4"
                >
                  <div className="flex items-center gap-2 text-calm-sage">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">{result.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.advice}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={reset} className="rounded-xl gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Retake
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-calm-sage text-primary-foreground hover:bg-calm-sage/90 gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelfHelpQuiz;
