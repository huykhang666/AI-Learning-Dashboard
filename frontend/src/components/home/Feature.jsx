import { useTranslation } from "react-i18next";
import {
  Mic,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Link,
  FileText,
  Tag,
  Lock,
  Upload,
  Settings,
  GraduationCap,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

function Feature() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Mic,
      title: t("feature.cards.whisper.title"),
      description: t("feature.cards.whisper.description"),
    },
    {
      icon: Sparkles,
      title: t("feature.cards.summary.title"),
      description: t("feature.cards.summary.description"),
    },
    {
      icon: MessageSquare,
      title: t("feature.cards.chat.title"),
      description: t("feature.cards.chat.description"),
    },
    {
      icon: TrendingUp,
      title: t("feature.cards.progress.title"),
      description: t("feature.cards.progress.description"),
    },
    {
      icon: Link,
      title: t("feature.cards.youtube.title"),
      description: t("feature.cards.youtube.description"),
    },
    {
      icon: FileText,
      title: t("feature.cards.export.title"),
      description: t("feature.cards.export.description"),
    },
    {
      icon: Tag,
      title: t("feature.cards.tags.title"),
      description: t("feature.cards.tags.description"),
    },
    {
      icon: Lock,
      title: t("feature.cards.security.title"),
      description: t("feature.cards.security.description"),
    },
  ];

  const action = [
    {
      icon: Upload,
      title: t("feature.steps.upload.title"),
      description: t("feature.steps.upload.description"),
    },
    {
      icon: Settings,
      title: t("feature.steps.process.title"),
      description: t("feature.steps.process.description"),
    },
    {
      icon: GraduationCap,
      title: t("feature.steps.learn.title"),
      description: t("feature.steps.learn.description"),
    },
  ];

  return (
    <section className="bg-gray-100 py-20" id="Feature">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4">
            {t("feature.title")}
          </div>
          <h2 className="text-gray-900 text-2xl md:text-4xl font-bold mb-4">
            {t("feature.heading")}
          </h2>
          <p className="text-gray-700 text-base max-w-xl mx-auto">
            {t("feature.description")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4 mt-20">
            {t("feature.process.title")}
          </div>
          <h2 className="text-gray-900 font-bold text-2xl md:text-4xl mb-4">
            {t("feature.process.heading")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {action.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;