import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeroStatCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const HeroStatCard = ({ title, icon, children }: HeroStatCardProps) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
};
