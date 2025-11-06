import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !semester || !documentType || !title || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Insert document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title,
          description,
          semester: parseInt(semester),
          document_type: documentType,
          file_url: publicUrl,
          file_name: file.name,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Document importé !",
        description: `${file.name} a été ajouté au semestre ${semester}`,
      });

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setSemester("");
      setDocumentType("");
      
      // Redirect to library
      navigate("/library");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Importer un Document
            </h1>
            <p className="text-muted-foreground">
              Partagez vos examens et documents avec la communauté IFRI
            </p>
          </div>

          <Card className="shadow-lg border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="h-5 w-5 text-secondary" />
                Nouveau Document
              </CardTitle>
              <CardDescription>
                Remplissez les informations ci-dessous pour ajouter un document à la bibliothèque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du document *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Examen Final - Mathématiques"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez des détails sur le document..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((s) => (
                        <SelectItem key={s} value={s.toString()}>
                          Semestre {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de document</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="examen">Examen</SelectItem>
                      <SelectItem value="td">TD</SelectItem>
                      <SelectItem value="tp">TP</SelectItem>
                      <SelectItem value="cours">Cours</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Fichier</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-8 w-8" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      ) : (
                        <div>
                          <UploadIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Cliquez pour sélectionner un fichier
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX (max. 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2 bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                  size="lg"
                  disabled={uploading}
                >
                  <UploadIcon className="h-4 w-4" />
                  {uploading ? "Import en cours..." : "Importer le document"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
