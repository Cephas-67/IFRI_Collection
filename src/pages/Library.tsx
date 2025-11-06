import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoadingDocs(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('semester', parseInt(selectedSemester))
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setDocuments(data);
      }
      setLoadingDocs(false);
    };

    if (user) {
      fetchDocuments();
    }
  }, [selectedSemester, user]);

  const semesters = [
    { id: "1", name: "Semestre 1", documents: documents.filter(d => d.semester === 1).length },
    { id: "2", name: "Semestre 2", documents: documents.filter(d => d.semester === 2).length },
    { id: "3", name: "Semestre 3", documents: documents.filter(d => d.semester === 3).length },
    { id: "4", name: "Semestre 4", documents: documents.filter(d => d.semester === 4).length },
    { id: "5", name: "Semestre 5", documents: documents.filter(d => d.semester === 5).length },
    { id: "6", name: "Semestre 6", documents: documents.filter(d => d.semester === 6).length },
  ];

  if (loading) {
    return null;
  }


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Bibliothèque de Documents
          </h1>
          <p className="text-muted-foreground">
            Accédez à tous les examens et documents académiques organisés par semestre
          </p>
        </div>

        <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-8">
            {semesters.map((sem) => (
              <TabsTrigger 
                key={sem.id} 
                value={sem.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-semibold">S{sem.id}</span>
                  <Badge variant="secondary" className="text-xs">
                    {sem.documents}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {semesters.map((sem) => (
            <TabsContent key={sem.id} value={sem.id} className="space-y-4">
              {loadingDocs ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement des documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun document pour ce semestre
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                  <Card 
                    key={doc.id} 
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <FileText className="h-8 w-8 text-primary mb-2" />
                        <Badge variant={doc.document_type === "examen" ? "default" : "secondary"}>
                          {doc.document_type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                      <CardDescription>
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Library;
