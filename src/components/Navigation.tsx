import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Calendar, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="IFRI Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              IFRI Collection
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/library">
              <Button 
                variant={isActive("/library") ? "default" : "ghost"}
                className={cn(
                  "gap-2",
                  isActive("/library") && "bg-primary text-primary-foreground"
                )}
              >
                <FileText className="h-4 w-4" />
                Bibliothèque
              </Button>
            </Link>
            
            <Link to="/upload">
              <Button 
                variant={isActive("/upload") ? "secondary" : "ghost"}
                className={cn(
                  "gap-2",
                  isActive("/upload") && "bg-secondary text-secondary-foreground"
                )}
              >
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </Link>

            <Link to="/schedule">
              <Button 
                variant={isActive("/schedule") ? "default" : "ghost"}
                className={cn(
                  "gap-2",
                  isActive("/schedule") && "bg-accent text-accent-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
                Emploi du temps
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
