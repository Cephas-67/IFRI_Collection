import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Schedule = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("1");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('year', parseInt(selectedYear))
        .order('day_of_week')
        .order('start_time');
      
      if (!error && data) {
        setSchedules(data);
      }
    };

    if (user) {
      fetchSchedules();
    }
  }, [selectedYear, user]);
  const years = [
    { id: "1", name: "1ère Année" },
    { id: "2", name: "2ème Année" },
    { id: "3", name: "3ème Année" },
  ];

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Format HH:MM from HH:MM:SS
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            Emploi du Temps
          </h1>
          <p className="text-muted-foreground">
            Consultez les horaires de cours pour chaque année
          </p>
        </div>

        <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            {years.map((year) => (
              <TabsTrigger 
                key={year.id} 
                value={year.id}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {year.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {years.map((year) => (
            <TabsContent key={year.id} value={year.id}>
              <div className="grid gap-4">
                {daysOfWeek.map((day) => (
                  <Card key={day} className="border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="text-xl">{day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {schedules.filter((item) => item.day_of_week === day).length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun cours ce jour
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {schedules
                            .filter((item) => item.day_of_week === day)
                            .map((item, idx) => (
                              <div 
                                key={idx}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent hover:from-muted transition-all"
                              >
                                <div className="space-y-1 flex-1">
                                  <h3 className="font-semibold text-foreground">{item.subject}</h3>
                                  <p className="text-sm text-muted-foreground">{item.professor}</p>
                                </div>
                                
                                <div className="flex gap-4 mt-2 md:mt-0">
                                  <Badge variant="outline" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                  </Badge>
                                  <Badge variant="secondary" className="gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.room}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Schedule;
