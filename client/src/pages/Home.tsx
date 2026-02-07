/**
 * Design Philosophy: ソフト・ミニマリズム × ウェルネス美学
 * - グラスモーフィズム風カード
 * - 滑らかなアニメーション
 * - 段階的な質問提示
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateReview, GOOGLE_REVIEW_URL, questions, type QuestionAnswers } from "@/lib/reviewGenerator";
import { Check, Copy, Edit3, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [answers, setAnswers] = useState<Partial<QuestionAnswers>>({});
  const [generatedReview, setGeneratedReview] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState('');

  const handleAnswer = (questionKey: keyof QuestionAnswers, answer: string) => {
    const newAnswers = { ...answers, [questionKey]: answer };
    setAnswers(newAnswers);

    // 次のステップへ進む
    if (currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 300);
    } else if (currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 300);
    } else if (currentStep === 3) {
      // 口コミ生成
      const review = generateReview(newAnswers as QuestionAnswers);
      setGeneratedReview(review);
      setEditedReview(review);
      setTimeout(() => setCurrentStep('result'), 300);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = isEditing ? editedReview : generatedReview;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('口コミ文章をコピーしました！');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({});
    setGeneratedReview('');
    setEditedReview('');
    setCopied(false);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 texture-overlay relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 -z-10" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Re:Story
          </h1>
          <p className="text-muted-foreground text-lg">
            ご来店ありがとうございます
          </p>
          <p className="text-muted-foreground mt-2">
            簡単なアンケートにお答えいただき、口コミ投稿のご協力をお願い致します✨
          </p>
        </div>

        {/* Question Cards */}
        {currentStep !== 'result' && (
          <Card className="glass-card p-8 md:p-10 rounded-2xl animate-slide-in-up">
            {/* Progress indicator */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    step <= currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Question 1 */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {questions.q1.title}
                </h2>
                <div className="grid gap-3">
                  {questions.q1.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswer('q1', option)}
                      className="justify-start text-left h-auto py-4 px-6 text-base hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 bg-card/50"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2 */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {questions.q2.title}
                </h2>
                <div className="grid gap-3">
                  {questions.q2.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswer('q2', option)}
                      className="justify-start text-left h-auto py-4 px-6 text-base hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 bg-card/50"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {questions.q3.title}
                </h2>
                <div className="grid gap-3">
                  {questions.q3.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswer('q3', option)}
                      className="justify-start text-left h-auto py-4 px-6 text-base hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 bg-card/50"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Result Card */}
        {currentStep === 'result' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card p-8 md:p-10 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                  生成された口コミ文章
                </h2>
              </div>
              
              {!isEditing ? (
                <div className="bg-muted/30 rounded-xl p-6 mb-6 border border-border/50 relative group">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {generatedReview}
                  </p>
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedReview(generatedReview);
                    }}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    編集
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <textarea
                    value={editedReview}
                    onChange={(e) => setEditedReview(e.target.value)}
                    className="w-full min-h-[200px] bg-muted/30 rounded-xl p-6 border border-border/50 text-foreground leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="口コミ文章を編集してください..."
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedReview(generatedReview);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedReview(editedReview);
                        setIsEditing(false);
                        toast.success('編集内容を保存しました');
                      }}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      保存
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      コピー完了！
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      文章をコピー
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => window.open(GOOGLE_REVIEW_URL, '_blank')}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Googleマップで投稿する
                </Button>
              </div>
            </Card>

            <Card className="glass-card p-6 rounded-xl">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                次の手順
              </h3>
              <ol className="space-y-2 text-muted-foreground text-sm">
                <li>1. 上の「文章をコピー」ボタンを押してください</li>
                <li>2. 「Googleマップで投稿する」ボタンを押してください</li>
                <li>3. Googleマップが開いたら、コピーした文章を貼り付けて投稿完了です✨</li>
              </ol>
              <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">アドバイス：</span>
                  寝る前は必ずパックを行い保湿を頑張ると、よりお肌が育ちやすくなりますよ！
                </p>
              </div>
            </Card>

            <div className="text-center">
              <Button
                onClick={handleReset}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                最初からやり直す
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
