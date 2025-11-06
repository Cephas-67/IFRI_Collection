import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Calendar, ArrowRight } from "lucide-react";
import ifriBuildingImage from "@/assets/ifri-building.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="IFRI Logo" className="h-12 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                IFRI Collection
              </span>
            </div>
            <Link to="/auth">
              <Button variant="outline">Se connecter</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${ifriBuildingImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Bienvenue sur IFRI Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              La plateforme collaborative pour partager et accéder aux documents académiques de l'IFRI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Link to="/library">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Accéder à la bibliothèque
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bibliothèque organisée</h3>
              <p className="text-muted-foreground">
                Accédez à tous vos documents classés par semestre (S1 à S6) avec une navigation intuitive
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Partage facile</h3>
              <p className="text-muted-foreground">
                Importez vos examens et TD pour aider toute la communauté étudiante de l'IFRI
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emplois du temps</h3>
              <p className="text-muted-foreground">
                Consultez les horaires de cours pour chaque année d'étude en temps réel
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 IFRI Collection. Fait avec ❤️ pour les étudiants IFRI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
